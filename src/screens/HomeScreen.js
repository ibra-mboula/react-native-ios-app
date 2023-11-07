import React, { useEffect, useState } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView, View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';

function HomeScreen() {
  const [publishedRecipes, setPublishedRecipes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'recipes'), where('published', '==', true));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipes = [];
      querySnapshot.forEach((doc) => {
        recipes.push({ id: doc.id, ...doc.data() });
      });
      setPublishedRecipes(recipes);
    }, (error) => {
      console.error("Failed to fetch recipes:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleFavoritePress = async (recipe) => {
    try {
      const recipeRef = doc(db, 'recipes', recipe.id);
      await updateDoc(recipeRef, {
        isFavorite: !recipe.isFavorite // Toggle the isFavorite state
      });
      // Update the local state to reflect the change
      setPublishedRecipes(publishedRecipes.map(r => {
        return r.id === recipe.id ? { ...r, isFavorite: !r.isFavorite } : r;
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
            
            {/*<Text>Publié par: {recipe.userName}</Text> */}
            
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
  ownerName: {
    fontWeight: 'bold'
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
