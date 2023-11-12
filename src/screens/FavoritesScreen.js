import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { db, auth } from '../services/firebaseConfig';
import { query, collection, where, onSnapshot, getDoc, doc } from 'firebase/firestore';

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
        {favoriteRecipes.map((recipe) => {
          const { style: categoryStyle, emoji: categoryEmoji } = getCategoryStyleAndEmoji(recipe.category);
          return (
            <View key={recipe.id} style={styles.recipeCard}>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <View style={styles.recipeDetails}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={[styles.category, categoryStyle]}>{recipe.category} {categoryEmoji}</Text>
                <Text style={styles.prep_} >prep : {recipe.prepTime}</Text>
                <Text style={styles.ingredients_}> Ingredients :</Text>
                <View style={styles.ingredientsList}>
                  {recipe.ingredients.map((ingredient, idx) => (
                    <Text key={idx} style={styles.ingredient}>{ingredient}</Text>
                  ))}
                </View>
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
    width: '30%', // Taille des cartes
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeImage: {
    width: '100%', // Image pleine largeur
    height: 150, // Hauteur fixe pour les images
    borderRadius: 10, // Moins arrondi
  },
  recipeDetails: {
    alignItems: 'center',
    marginTop: 5,
    
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  category: {
    fontStyle: 'italic',
    marginBottom: 15,

  },
  categoryCar: {
    color: 'red',
  },
  categoryVeg: {
    color: 'green',
  },
  ingredients_: {
    marginBottom: 10,
    color: 'gray',

  },
  prep_: {
    marginBottom: 10,
    color: 'gray',
    fontWeight: 'bold',

  },
  
 
});

export default FavoritesScreen;
