import React from 'react';

// Ici, on crée un contexte 
// C'est pour partager des données comme l'état de l'utilisateur
const UserContext = React.createContext();

// Et enfin, on exporte notre UserContext pour l'utiliser dans toute l'app.
export default UserContext;
