
import app from "./firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// on initialise l'authentification
const auth = getAuth(app);

// On va créer une fonction pour l'inscription
export const signUp = async (email, password) => {
    try{ 
        // On utilise 'await' pour patienter le temps que Firebase fasse son travail.
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Si tout va bien, on retourne les infos de l'utilisateur.
        return { success: true, user: userCredential.user };
    } catch(error){
        // En cas d'erreur
        return { success: false , error : error.message };
    }
};

// Maintenant, on s'occupe de la connexion
export const login = async (email, password) => {
    try{
        // Encore une fois, 'await' pour attendre la réponse de Firebase.
        await signInWithEmailAndPassword(auth, email, password);
        // Si on arrive à se connecter, c'est tout bon !
        return {success: true};
    } catch(error){
        // Et si ça ne marche pas, on gère l'erreur.
        return { success: false , error : error.message};
    }
};
