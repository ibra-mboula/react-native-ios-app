import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Button,
} from 'react-native';
import { getUserDetailsByEmail, getAllUsers } from '../services/userServices';
import { auth, db } from '../services/firebaseConfig';
import { doc, deleteDoc, getDocs, query, collection, where, updateDoc } from 'firebase/firestore';

import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';

function ProfileScreen() {
  const [userDetails, setUserDetails] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableRecipe, setEditableRecipe] = useState(null);

  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); 
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    const fetchUserDetailsAndRecipes = async () => {
      const users = await getAllUsers();
      const currentUser = users.find(user => user.email === auth.currentUser.email);
      if (currentUser) {
        setUserDetails(currentUser);
      }

      // Récupération des recettes
      const userRecipesSnapshot = await getDocs(query(collection(db, 'recipes'), where('userId', '==', auth.currentUser.uid)));
      let  recipesData = userRecipesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

       // Récupération des noms des utilisateurs pour chaque recette
        recipesData = await Promise.all(recipesData.map(async (recipe) => {
        const userDetailSnapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', recipe.userId)));
        const userDetailData = userDetailSnapshot.docs.map(doc => doc.data());
        return {
          ...recipe,
          userName: userDetailData.length > 0 ? userDetailData[0].name : 'Unknown'
        };
      }));




      setUserRecipes(recipesData);
    };

    fetchUserDetailsAndRecipes();
  }, []);

  const deleteRecipe = async (recipeId) => {
    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      setUserRecipes(currentRecipes => currentRecipes.filter(recipe => recipe.id !== recipeId));
      console.error("Recipe successfully deleted!");
    } catch (error) {
      console.error("Error deleting recipe: ", error);
    }
  };

  const startEditRecipe = (recipe) => {
    setEditableRecipe({ ...recipe });
    setIsEditing(true);
  };

  const handleRecipeChange = (name, value) => {
    setEditableRecipe(prev => ({ ...prev, [name]: value }));
  };

  
    const handleIngredientChange = (index, value) => {
        setEditableRecipe(prev => {
          const newIngredients = [...prev.ingredients];
          newIngredients[index] = value;
          return { ...prev, ingredients: newIngredients };
        });
      };

  const saveRecipe = async () => {
    if (editableRecipe && editableRecipe.id) {
      const recipeRef = doc(db, 'recipes', editableRecipe.id);
      try {
        await updateDoc(recipeRef, { ...editableRecipe });
        setUserRecipes(userRecipes.map(recipe => recipe.id === editableRecipe.id ? { ...editableRecipe } : recipe));
        setIsEditing(false);
        setEditableRecipe(null);
        console.log("Recipe successfully updated!");
      } catch (error) {
        console.error("Error updating recipe: ", error);
      }
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditableRecipe(null);
  };

  const publishRecipe = async (recipeId) => {
    const recipeRef = doc(db, 'recipes', recipeId);
    try {
      await updateDoc(recipeRef, { published: true });
      console.log("Recipe successfully published!");
      setUserRecipes(userRecipes.map(recipe => recipe.id === recipeId ? { ...recipe, published: true } : recipe));
    } catch (error) {
      console.error("Error publishing recipe: ", error);
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

  if (!userDetails) {
    return <Text>Loading...</Text>;
  }

  if (isEditing && editableRecipe) {
    return (
      <View style={styles.editContainer}>

      
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={editableRecipe.name}
          onChangeText={(text) => handleRecipeChange('name', text)}
          placeholder="Recipe Name"
        />
  
    
        <Text style={styles.label}>prepTime:</Text>
        <TextInput
          style={styles.input}
          value={editableRecipe.prepTime}
          onChangeText={(text) => handleRecipeChange('prepTime', text)}
          placeholder="Preparation Time"
        />
        
       
        <Text style={styles.label}>category:</Text>
        <TextInput
            style={styles.input}
            value={editableRecipe.category}
            onChangeText={(text) => handleRecipeChange('category', text)}
            placeholder="Category"
        />
        
  
    
        <Text style={styles.label}>Ingredients:</Text>
        {editableRecipe.ingredients.map((ingredient, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={ingredient}
            onChangeText={(text) => handleIngredientChange(index, text)}
            placeholder="Ingredient"
          />
        ))}
  
       
        <Button title="Save" onPress={saveRecipe} />
        <Button title="Cancel" onPress={cancelEdit} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Account Details</Text>
        <Button title="Sign Out" onPress={handleSignOut} style={styles.signOutButton} />
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.detailText}>Name: {userDetails.name}</Text>
      </View>
      <View style={styles.line} />

      {userRecipes.map((recipe) => {
        const { style: categoryStyle, emoji: categoryEmoji } = getCategoryStyleAndEmoji(recipe.category);
        return (
          <View key={recipe.id} style={styles.recipeCard}>
            {recipe.image && <Image source={{ uri: recipe.image }} style={styles.image} />}
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{recipe.name}</Text>
              <Text style={[styles.category, categoryStyle]}>Category: {recipe.category} {categoryEmoji}</Text>
              <Text style={styles.prep_} >Prep Time: {recipe.prepTime}</Text>
              <Text>Ingredients:</Text>
              {recipe.ingredients.map((ingredient, ingIndex) => (
                <Text key={ingIndex} style={styles.ingredient}>- {ingredient}</Text>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => startEditRecipe(recipe)}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => deleteRecipe(recipe.id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.publishButton]}
                onPress={() => publishRecipe(recipe.id)}>
                <Text>Publish</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  editContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    padding: 10,
    width: '80%',
    marginBottom: 10,
    borderRadius: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  line: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginVertical: 10,
  },
  recipeContainer: {
    borderWidth: 1,
    borderColor: '#dddddd',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderRadius: 5,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    margin: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  category: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  categoryCar: {
    color: 'red',
  },
  categoryVeg: {
    color: 'green',
  },
  signOutButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#FEDB91', 
  },
  deleteButton: {
    backgroundColor: '#FF7373', 
  },
  publishButton: {
    backgroundColor: '#54BBFF', 
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  recipeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeInfo: {
    padding: 10,
  },
  ingredient: {
    fontSize: 14,
    marginLeft: 10,
  },
  prep_: {
    marginBottom: 10,
    color: 'gray',
    fontWeight: 'bold',

  },

});

export default ProfileScreen;
