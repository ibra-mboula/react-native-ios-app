import { db } from './firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const getUserDetailsByEmail = async (email) => {
    const emailToQuery = email.toLowerCase(); // Convertir l'email en minuscules
    const userCollection = collection(db, 'users');
    const q = query(userCollection, where("email", "==", emailToQuery));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        console.log("Fetched user details:", user);
        return user;
    } else {
        console.log("No details found for email:", emailToQuery); // Utilisez emailToQuery pour le log
        return null;
    }
}

export const getAllUsers = async () => {
    const userCollection = collection(db, 'users');
    const querySnapshot = await getDocs(userCollection);
    return querySnapshot.docs.map(doc => doc.data());
}





