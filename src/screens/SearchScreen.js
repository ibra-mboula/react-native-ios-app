import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { db } from '../services/firebaseConfig';
import { query, collection, where, getDocs } from 'firebase/firestore';

function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [isVegSelected, setIsVegSelected] = useState(false);
  const [isCarSelected, setIsCarSelected] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'recipes'));

      if (isVegSelected || isCarSelected) {
        const categories = [];
        if (isVegSelected) categories.push('veg');
        if (isCarSelected) categories.push('car');
        q = query(q, where('category', 'in', categories));
      }

      const querySnapshot = await getDocs(q);
      const fetchedRecipes = [];
      querySnapshot.forEach(doc => {
        fetchedRecipes.push({ id: doc.id, ...doc.data() });
      });
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'veg':
        return '🥦';
      case 'car':
        return '🥩';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Veg 🥦"
          color={isVegSelected ? 'green' : 'grey'}
          onPress={() => setIsVegSelected(!isVegSelected)}
        />
        <Button
          title="Car 🥩"
          color={isCarSelected ? 'green' : 'grey'}
          onPress={() => setIsCarSelected(!isCarSelected)}
        />
      </View>
      <Button title="Rechercher" onPress={handleSearch} />
      {loading ? <Text>Chargement...</Text> : (
        <ScrollView>
          {recipes.map(recipe => (
            <View key={recipe.id} style={styles.recipeContainer}>
              <Text style={styles.recipeName}>{recipe.name} {getCategoryEmoji(recipe.category)}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  recipeContainer: {
    
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default SearchScreen;
