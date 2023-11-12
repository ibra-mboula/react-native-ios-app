import React, { useEffect, useState } from 'react';
import { db, auth } from '../services/firebaseConfig';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

function HomeScreen() {
  const [publishedRecipes, setPublishedRecipes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'recipes'), where('published', '==', true));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipes = [];
      querySnapshot.forEach((doc) => {
        recipes.push({ id: doc.id, ...doc.data() });
      });

      if (auth.currentUser) {
        const favoritesQuery = query(collection(db, 'favorites'), where('userId', '==', auth.currentUser.uid));
        onSnapshot(favoritesQuery, (querySnapshot) => {
          const favoriteIds = querySnapshot.docs.map(doc => doc.data().recipeId);
          const updatedRecipes = recipes.map(recipe => ({
            ...recipe,
            isFavorite: favoriteIds.includes(recipe.id)
          }));
          setPublishedRecipes(updatedRecipes);
        });
      } else {
        setPublishedRecipes(recipes);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFavoritePress = async (recipe) => {
    if (!auth.currentUser) {
      console.error("No user logged in");
      return;
    }
  
    try {
      const favoriteId = `${auth.currentUser.uid}_${recipe.id}`;
      const favoriteRef = doc(db, 'favorites', favoriteId);
  
      if (recipe.isFavorite) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, {
          userId: auth.currentUser.uid,
          recipeId: recipe.id
        });
      }
  
      setPublishedRecipes(publishedRecipes.map(r => {
        if (r.id === recipe.id) {
          return { ...r, isFavorite: !r.isFavorite };
        }
        return r;
      }));
  
      console.log("Favorite state toggled for recipe:", recipe.name);
    } catch (error) {
      console.error("Failed to toggle favorite state for recipe:", error);
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
