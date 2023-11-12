
import { db } from './firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

//  pour obtenir les détails d'un utilisateur par son email
export const getUserDetailsByEmail = async (email) => { // export pour pouvoir utiliser cette fonction dans d'autres fichiers
    // Convertir l'email en minuscules pour éviter les problèmes de correspondance de casse
    const emailToQuery = email.toLowerCase(); 

    // On se réfère à la collection 'users' dans notre base de données Firestore.
    const userCollection = collection(db, 'users');

    // On prépare notre requête : chercher un utilisateur avec l'email spécifié.
    const q = query(userCollection, where("email", "==", emailToQuery));

    // On lance la requête et attend ses résultats.
    const querySnapshot = await getDocs(q);

    // Si on trouve quelque chose, on renvoie les données du premier document.
    if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data(); // On récupère les données du premier document
        console.log("Fetched user details:", user); // On affiche les données dans la console
        return user;
    } else {
        // Sinon, on indique qu'aucun utilisateur n'a été trouvé pour cet email.
        console.log("No details found for email:", emailToQuery);
        return null;
    }
}

// Pour récupérer tous les utilisateurs.
export const getAllUsers = async () => {
    // On pointe encore une fois vers notre collection 'users'.
    const userCollection = collection(db, 'users');

    // On récupère tous les documents de cette collection.
    const querySnapshot = await getDocs(userCollection);

    // transforme ces documents en un tableau d'objets utilisateurs.
    console.log("Fetched all users:", querySnapshot.docs.map(doc => doc.data()));
    return querySnapshot.docs.map(doc => doc.data());
}



