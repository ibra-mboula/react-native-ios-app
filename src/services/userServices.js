import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import app from './firebaseConfig';

const db = getFirestore(app);
const auth = getAuth(app);

// Fonction pour récupérer les informations d'un utilisateur depuis Firestore
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
