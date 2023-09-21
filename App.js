//import { StatusBar } from 'expo-status-bar';
import { Button,TextInput,StatusBar,StyleSheet, Text, View } from 'react-native';

import React, {useState} from 'react';
import { signUp,login } from './auth';


export default function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const result = await signUp(email, password);
    if(!result.success){
      alert(result.error);
    }else{
      alert("User Created");
    }
  }

  const handleLogin = async () => {
    const result = await login(email, password);
    if(!result.success){
      alert(result.error);
    }else{
      alert("User Logged In");
    }
  }

  return (

    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />  
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="S'inscrire" onPress={handleSignUp} />
      <Button title="Se connecter" onPress={handleLogin} />
      <StatusBar style="auto" />

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
});
