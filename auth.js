import app from "./firebaseConfig";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app);
export const signUp = async (email, password) => {

    try{
        await createUserWithEmailAndPassword(auth, email, password);
        return{success: true};
    } catch(error){
        return { success: false , error : error.message};
    }
};

export const login = async (email, password) => {
    try{
        await signInWithEmailAndPassword(auth, email, password);
        return{success: true};
    } catch(error){
        return { success: false , error : error.message};
    }
};



