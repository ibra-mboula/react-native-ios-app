import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { db, auth } from '../services/firebaseConfig';
import { query, collection, where, onSnapshot,getDoc, doc } from 'firebase/firestore';

function FavoritesScreen() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.currentUser) {
      setError('Aucun utilisateur connecté');
      return;
    }

    const userFavoritesQuery = query(
      collection(db, 'favorites'), 
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(userFavoritesQuery, async (querySnapshot) => {
      try {
        const favoriteIds = querySnapshot.docs.map(doc => doc.data().recipeId);
        const fetchedRecipes = await Promise.all(
          favoriteIds.map(async id => {
            const docSnap = await getDoc(doc(db, 'recipes', id));
            return { id, ...docSnap.data() };
          })
        );
        setFavoriteRecipes(fetchedRecipes);
      } catch (error) {
        setError('Erreur lors de la récupération des recettes favorites');
        console.error("Error fetching favorite recipes:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ScrollView>
      {favoriteRecipes.map((recipe) => (
        <View key={recipe.id} style={styles.recipeContainer}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          {recipe.image && <Image source={{ uri: recipe.image }} style={styles.recipeImage} />}


          <Text style={styles.category}>{recipe.category}</Text>
            {recipe.ingredients.map((ingredient, idx) => (
              <Text key={idx} style={styles.ingredient}>- {ingredient}</Text>
            ))}

          
          
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  recipeContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  recipeName: {
    fontSize: 18
  },
  recipeImage: {
    width: 100, 
    height: 100,
    borderRadius: 50,
    marginVertical: 10
  }
});

export default FavoritesScreen;
