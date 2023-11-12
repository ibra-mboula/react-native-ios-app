import React, { useEffect, useState } from 'react';
import { db, auth } from '../services/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc, deleteDoc, getDoc  } from 'firebase/firestore';
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
    }, (error) => {
      console.error("Failed to fetch recipes:", error);
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
  

  return (
    <ScrollView>
      {publishedRecipes.map((recipe) => (
        <View key={recipe.id} style={styles.recipeContainer}>
          <View style={styles.recipeContent}>
            <Text style={styles.recipeName}>{recipe.name}</Text>
            {recipe.image && <Image source={{ uri: recipe.image }} style={styles.recipeImage} />}
            <Text style={styles.category}>{recipe.category}</Text>
            {recipe.ingredients.map((ingredient, idx) => (
              <Text key={idx} style={styles.ingredient}>- {ingredient}</Text>
            ))}
          </View>
          <TouchableOpacity onPress={() => handleFavoritePress(recipe)} style={styles.favoriteButton}>
            <Ionicons name={recipe.isFavorite ? 'star' : 'star-outline'} size={30} color='#FFDD44' />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  recipeContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  recipeContent: {
    flex: 1
  },
  recipeName: {
    fontSize: 18
  },
  recipeImage: {
    width: 100, 
    height: 100,
    borderRadius: 50,
    marginVertical: 10
  },
  category: {
    fontStyle: 'italic'
  },
  ingredient: {
    fontSize: 16
  },
  favoriteButton: {
    padding: 10
  }
});

export default HomeScreen;
