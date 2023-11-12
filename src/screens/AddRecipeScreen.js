import React, { useState } from 'react';
import { Keyboard ,View, Text, TextInput, Button, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform,ScrollView,TouchableWithoutFeedback,TouchableOpacity  } from 'react-native';
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.scrollView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

          <View style={styles.innerContainer}>
            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

            <View style={styles.buttonGroup}>
              <Button title="Pick an image" onPress={pickImage} color="#3498db" />
              <Button title="Take a photo" onPress={takePhoto} color="#3498db" />
  
            </View>

            <TouchableOpacity style={styles.addButton} onPress={addRecipe}>
              <Text style={styles.buttonText}>Add Recipe</Text>
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder="Name of the recipe" onChangeText={setName} value={name} />
            <TextInput style={styles.input} placeholder="Preparation time" onChangeText={setPrepTime} value={prepTime} />
            <TextInput style={[styles.input, styles.multiLineInput]} placeholder="Ingredients (separated by new lines)" multiline onChangeText={setIngredients} value={ingredients} />
            
            
              <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker} mode="dialog">
                <Picker.Item label="Select a category" value="" />
                <Picker.Item label="Veg 🥦" value="veg" />
                <Picker.Item label="Car 🥩" value="car" />
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
    justifyContent: 'flex-start',
    padding: 20,
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#3498db',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  multiLineInput: {
    height: 100,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
    width: '90%',
    borderRadius: 5,
    borderColor: '#3498db',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  addButton: {
    backgroundColor: "#2ecc71", 
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center', 
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default AddRecipeScreen;
