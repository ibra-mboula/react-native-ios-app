import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Button,
} from 'react-native';
import { getUserDetailsByEmail, getAllUsers } from '../services/userServices';
import { auth, db } from '../services/firebaseConfig';
import { doc, deleteDoc, getDocs, query, collection, where, updateDoc } from 'firebase/firestore';

function ProfileScreen() {
  const [userDetails, setUserDetails] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableRecipe, setEditableRecipe] = useState(null);

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

    // Fonction pour modifier un ingrédient spécifique
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

  if (!userDetails) {
    return <Text>Loading...</Text>;
  }

  if (isEditing && editableRecipe) {
    return (
      <View style={styles.editContainer}>

        {/* TextInput for editing Name */}
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={editableRecipe.name}
          onChangeText={(text) => handleRecipeChange('name', text)}
          placeholder="Recipe Name"
        />
  
        {/* TextInput for editing prepTime */}
        <Text style={styles.label}>prepTime:</Text>
        <TextInput
          style={styles.input}
          value={editableRecipe.prepTime}
          onChangeText={(text) => handleRecipeChange('prepTime', text)}
          placeholder="Preparation Time"
        />
        
        {/* TextInput for editing category */}
        <Text style={styles.label}>category:</Text>
        <TextInput
            style={styles.input}
            value={editableRecipe.category}
            onChangeText={(text) => handleRecipeChange('category', text)}
            placeholder="Category"
        />
        
  
        {/* TextInput for editing Ingredient */}
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
  
        {/* Add more input fields for editing other recipe attributes as needed */}
        <Button title="Save" onPress={saveRecipe} />
        <Button title="Cancel" onPress={cancelEdit} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      {/* User details */}
      <Text style={styles.header}>Account Details</Text>
      <Text>Name: {userDetails.name}</Text>
      <Text>Category: {userDetails.category}</Text>
      <View style={styles.line} />

      {/* List of recipes */}
      {userRecipes.map((recipe, index) => (
        <View key={recipe.id} style={styles.recipeContainer}>
          <Text style={styles.recipeTitle}>{recipe.name}</Text>


                    {/* Display the image */}
                    {recipe.image && (
                        <Image
                            source={{ uri: recipe.image }}
                            style={styles.image}
                            onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                        />
                    )}

                    <Text>Temps de préparation: {recipe.prepTime}</Text>
                    <Text>Catégorie: {recipe.category}</Text>
                    <Text>Ingrédients:</Text>
                    {recipe.ingredients.map((ingredient, ingIndex) => (
                        <Text key={ingIndex}>- {ingredient}</Text>
                    ))}
          


           {/* Edit and Delete buttons */}
          <View style={styles.buttonContainer}>

            <TouchableOpacity
              style={styles.button}
              onPress={() => startEditRecipe(recipe)}>
              <Text>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => deleteRecipe(recipe.id)}>
              <Text>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.button}
            onPress={() => publishRecipe(recipe.id)}>
            <Text>Publish</Text>
          </TouchableOpacity>

          </View>
        </View>
      ))}
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
    borderColor: 'gray',
    padding: 10,
    width: '80%',
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  line: {
    height: 1,
    backgroundColor: 'black',
    width: '100%',
    marginVertical: 10,
  },
  recipeContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
},

});

export default ProfileScreen;
