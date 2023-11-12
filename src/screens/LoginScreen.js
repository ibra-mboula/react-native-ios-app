import React, { useState } from 'react'; 
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, Button, StatusBar } from 'react-native';
import { signUp, login } from '../services/auth'; // Nos fonctions pour s'inscrire et se connecter



// Voici notre écran de connexion.
function LoginScreen({ navigation }) {
    // On utilise useState pour garder une trace de l'email et du mot de passe.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Fonction pour gérer l'inscription - on navigue vers l'écran d'inscription.
    const handleSignUp = async () => {
        navigation.navigate('SignUp');
    }
  
    // gérer la connexion - on utilise notre fonction login du service auth.js
    const handleLogin = async () => {
        const result = await login(email, password); 

        // Si la connexion échoue, on affiche une alerte.
        if (!result.success) {
            alert(result.error);
        } else {
            // Si la connexion réussit, on navigue vers l'écran principal.
            navigation.navigate('Main'); 
        }
    }

    // partie visible de notre écran, le JSX.
    return (
        // KeyboardAvoidingView, pour éviter que le clavier ne cache nos champs de saisie.
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Text style={styles.title}>Bienvenue 👨🏾‍🍳</Text>
            {/* Des champs de saisie pour l'email et le mot de passe */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button title="S'inscrire" onPress={handleSignUp} color="#D591FF" />
                <Button title="Se connecter" onPress={handleLogin} color="#32CD32" />
            </View>
            <StatusBar style="auto" />
        </KeyboardAvoidingView>
    );
}
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'flex-start', 
        paddingTop: 100,
        paddingHorizontal: 20, 
      },
      
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 50,
        color: '#22AED1',
      },
      input: {
        width: '80%',
        height: 40,
        borderColor: '#FFDEAD',
        borderWidth: 1,
        marginBottom: 40,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
      },
      buttonContainer: {
        width: '80%',
        justifyContent: 'space-between',
      },
    });
    


      export default LoginScreen;