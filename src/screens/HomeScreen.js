import React, { useEffect, useState } from 'react';
import { db, auth } from '../services/firebaseConfig';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

function HomeScreen() {
  
    // Définition d'un état local pour stocker les recettes publiées
  const [publishedRecipes, setPublishedRecipes] = useState([]);

// Utilisation de useEffect pour charger et écouter les changements dans les recettes
  useEffect(() => {
    // Création d'une requête pour récupérer les recettes publiées
    const q = query(collection(db, 'recipes'), where('published', '==', true));

    // pour recevoir les mises à jour en temps réel, on utilise la fonction onSnapshot
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipes = [];
      querySnapshot.forEach((doc) => {// on parcourt les documents de la requête 

        // Construction d'une liste de recettes à partir des données reçues
        recipes.push({ id: doc.id, ...doc.data() }); // ...doc.data() permet de récupérer les données du document sous forme d'objet et de les ajouter dans le tableau recipes
      });

      // Traitement des favoris si un utilisateur est connecté
      if (auth.currentUser) { // si un utilisateur est connecté 
        // Création d'une requête pour récupérer les favoris de l'utilisateur connecté
        const favoritesQuery = query(collection(db, 'favorites'), where('userId', '==', auth.currentUser.uid));
        onSnapshot(favoritesQuery, (querySnapshot) => {

          const favoriteIds = querySnapshot.docs.map(doc => doc.data().recipeId);
          const updatedRecipes = recipes.map(recipe => ({ // on parcourt les recettes et on ajoute un attribut isFavorite à chaque recette
            ...recipe,
            isFavorite: favoriteIds.includes(recipe.id) // on vérifie si l'id de la recette est dans la liste des favoris
          }));
          setPublishedRecipes(updatedRecipes);
        });
      } else {
        setPublishedRecipes(recipes);
      }
    });

    return () => unsubscribe(); // on retourne la fonction unsubscribe pour arrêter l'écoute des changements
  }, []);

  // Fonction pour gérer les clics sur les favoris
  const handleFavoritePress = async (recipe) => {
    if (!auth.currentUser) {
      console.error("No user logged in");
      return;
    }
  
    try {
      const favoriteId = `${auth.currentUser.uid}_${recipe.id}`;
      const favoriteRef = doc(db, 'favorites', favoriteId);

      // Ajout ou suppression de la recette des favoris
      if (recipe.isFavorite) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, {
          userId: auth.currentUser.uid,
          recipeId: recipe.id
        });
      }
      
      // Mise à jour de l'état local des recettes publiées
      setPublishedRecipes(publishedRecipes.map(r => {
        if (r.id === recipe.id) { 
          return { ...r, isFavorite: !r.isFavorite };
        }
        return r;
      }));
  
      console.log("click:", recipe.name);
    } catch (error) {
      console.error("click error :", error);
    }
  };

  const getCategoryStyleAndEmoji = (category) => {
    switch (category) {
      case 'car':
        return { style: styles.categoryCar, emoji: '🥩' };
      case 'veg':
        return { style: styles.categoryVeg, emoji: '🥦' };
      default:
        return { style: {}, emoji: '' };
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.gridContainer}>
        {publishedRecipes.map((recipe) => {
          const { style: categoryStyle, emoji: categoryEmoji } = getCategoryStyleAndEmoji(recipe.category);
          return (
            <View key={recipe.id} style={styles.recipeCard}>
              <TouchableOpacity onPress={() => handleFavoritePress(recipe)} style={styles.favoriteButton}>
                <Ionicons name={recipe.isFavorite ? 'star' : 'star-outline'} size={24} color='#FFDD44' />
              </TouchableOpacity>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <View style={styles.recipeDetails}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={[styles.category, categoryStyle]}>{recipe.category} {categoryEmoji}</Text>
                {/* Autres détails de la recette ici, si nécessaire 
                <View style={styles.ingredientsContainer}>
                  {recipe.ingredients.slice(0, 2).map((ingredient, idx) => (
                    <Text key={idx} style={styles.ingredient}>- {ingredient}</Text>
                  ))}
                  {recipe.ingredients.length > 2 && <Text style={styles.moreIngredients}>+ more...</Text>}
                </View>*/}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  recipeCard: {
    backgroundColor: '#f9f9f9',
    width: '45%',
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  recipeDetails: {
    alignItems: 'center',
    marginTop: 5,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  category: {
    fontStyle: 'italic',
  },
  categoryCar: {
    color: 'red',
  },
  categoryVeg: {
    color: 'green',
  },
  ingredientsContainer: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  ingredient: {
    fontSize: 14,
  },
  moreIngredients: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  
});

export default HomeScreen;
