import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { addDoc, collection } from "firebase/firestore";
import { db } from '../services/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { storage } from '../services/firebaseConfig';

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function AddRecipeScreen() {
  const [image, setImage] = useState(null);
  const [prepTime, setPrepTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [category, setCategory] = useState("");

  const pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, 'recipes/' + Date.now());
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // ...
        }, 
        (error) => {
          console.error("Upload failed:", error);
          console.error("Detailed error:", error.serverResponse);
          reject(error);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const addRecipe = async () => {
    if (image) {
      const imageUrl = await uploadImage(image);
      try {
        await addDoc(collection(db, "recipes"), {
          image: imageUrl,
          prepTime,
          ingredients: ingredients.split('\n'),
          category
        });
        Alert.alert("Success!", "Your recipe has been added successfully.");
      } catch (error) {
        console.error("Error adding recipe: ", error);
      }
    } else {
      Alert.alert("Error", "Please select an image for the recipe.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Add a New Recipe</Text>
      <Button title="Pick an image" onPress={pickImage} />
      <Button title="Take a photo" onPress={takePhoto} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <TextInput 
        style={styles.input} 
        placeholder="Preparation time"
        onChangeText={setPrepTime}
        value={prepTime}
      />
      <TextInput 
        style={[styles.input, { height: 100 }]} 
        placeholder="Ingredients (separated by new lines)"
        multiline
        onChangeText={setIngredients}
        value={ingredients}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Category (veg/carn)"
        onChangeText={setCategory}
        value={category}
      />
      <Button title="Add Recipe" onPress={addRecipe} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  imagePreview: {
    width: 200, 
    height: 200, 
    marginVertical: 20
  }
});

export default AddRecipeScreen;
