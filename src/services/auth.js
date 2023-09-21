import app from "./firebaseConfig";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app);

//je cree une fonction qui va me permettre de me m'inscrire

export const signUp = async (email, password) => {
    try{ 
        //await pour attendre que la fonction se termine avant de passer a la suite
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch(error){
        return { success: false , error : error.message };
    }
};



//je cree une fonction qui va me permettre de me connecter
export const login = async (email, password) => {
    try{
        await signInWithEmailAndPassword(auth, email, password);
        return{success: true};
    } catch(error){
        return { success: false , error : error.message};
    }
};



