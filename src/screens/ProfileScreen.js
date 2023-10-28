import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUserDetailsByEmail } from '../services/userServices';
import { auth } from '../services/firebaseConfig';
import { getAllUsers } from '../services/userServices';



function ProfileScreen() {
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const users = await getAllUsers();
                console.log("All users:", users);
    
                // Trouver l'utilisateur avec l'email spécifié
                const currentUser = users.find(user => user.email === auth.currentUser.email);
                if (currentUser) {
                    setUserDetails(currentUser);
                } else {
                    console.log("Current user not found in the list of all users.");
                }
            } catch (error) {
                console.error("Error fetching all users:", error);
            }
        }
    
        fetchAllUsers();
    }, []);
    
    

    if (!userDetails) return <Text>Loading...</Text>;

    return (
        <View style={styles.container}>
            <Text>Compte</Text>
            <View style={styles.line} />
            <Text>Nom: {userDetails.name}</Text>
            <Text>Catégorie: {userDetails.category}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    line: {
        height: 1,
        width: '100%',
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
});

export default ProfileScreen;
