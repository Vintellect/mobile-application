import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '../auth/authContext';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [leftBtn, setleftBtn] = useState("Sign Up");
  const [rightBtn, setRightBtn] = useState("Sign In");

  const handleRightBtn = async () => {
    if(rightBtn == "Sign In"){
      await signIn(email, password);
      return;
    }
    if(rightBtn == "Sign Up"){
      signUp(email, password, displayName);
      return;
    }
    toggleBtn()
  };

  const toggleBtn = () => { 
    if (rightBtn == "Sign Up") { 
      setleftBtn("Sign Up");
      setRightBtn("Sign In");
      return;
    }
    setleftBtn("Cancel");
    setRightBtn("Sign Up");
  };

  const handleLeftBtn = () => {
    if (leftBtn == "Sign Up" || leftBtn == "Cancel") {
      toggleBtn()
      return;
    }
    signUp(email, password, displayName)    
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      {rightBtn == "Sign Up" ?(
        <TextInput
        style={styles.input}
        placeholder="Pseudonym"
        value={displayName}
        onChangeText={setDisplayName}
      />
      ): ""}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleLeftBtn} style={styles.btn} >
          <Text style={styles.btn_tittle}>{leftBtn}</Text>
        </Pressable>
        <Pressable onPress={handleRightBtn} style={styles.btn} >
          <Text style={styles.btn_tittle}>{rightBtn}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8eae2',
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  title: {
    fontSize: 24, // Adjust the font size as needed
    marginBottom: 20, // Add spacing below the text
    color: "#7d060d",
  },
  input: {
    width: '80%', // Adjust the width as needed
    marginBottom: 10,
    padding: 10,
    borderColor: '#7d060d',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%', // Adjust the width as needed
  },
  btn: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#7d060d',
    borderWidth: 1,
    borderRadius: 5,
  },
  btn_tittle: {
    color: "#f8eae2",
  }
});