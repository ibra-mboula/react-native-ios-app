import React, { useState } from 'react';
import { Keyboard ,View, Text, TextInput, Button, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform,ScrollView,TouchableWithoutFeedback  } from 'react-native';
import { addDoc, collection } from "firebase/firestore";
import { db } from '../services/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

import { storage } from '../services/firebaseConfig';
import { auth } from "../services/firebaseConfig";
import * as Camera from 'expo-camera';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function AddRecipeScreen() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [category, setCategory] = useState("");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

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
    const { status } = await Camera.requestCameraPermissionsAsync();

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
          name,
          prepTime,
          ingredients: ingredients.split('\n'),
          category,
          userId: auth.currentUser.uid
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    

      <ScrollView style={styles.scrollView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.innerContainer}>
          
          <Button title="Add Recipe" onPress={addRecipe} />
          <Button title="Pick an image" onPress={pickImage} />
          <Button title="Take a photo" onPress={takePhoto} />
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

          <TextInput 
            style={styles.input} 
            placeholder="Name of the recipe"
            onChangeText={setName}
            value={name}
          />
          
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

          {/* Liste déroulante pour la catégorie */}
          
            <Picker
              selectedValue={category}
              onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
              style={styles.picker}
              mode="dialog"
            >
              <Picker.Item label="Select a category" value="" />
              <Picker.Item label="Veg" value="veg" />
              <Picker.Item label="Car" value="car" />
            </Picker>
          
        </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
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


  imagePreview: {
    width: 200, 
    height: 200, 
    marginVertical: 20
  },
  pickerContainer: {
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff', 
  },
  picker: {
    width: '100%', 
    height: 50, 
  },
  
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20, 
  },
  
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18, 
  },



});

export default AddRecipeScreen;
