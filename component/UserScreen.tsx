// ProfileScreen.js
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../auth/authContext';

export default function UserScreen() {
  const { user, signOut } = useAuth();


  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome {user ? user.displayName : ''} !</Text>
      <Pressable onPress={signOut} style={styles.btn_fermer}>
        <Text style={styles.btn_tittle}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8eae2',
  },
  btn_tittle: {
    color: '#f8eae2',
  },  
  btn_fermer: {
    borderWidth: 0.5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems:'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    margin: 8,
    backgroundColor: '#7d060d',
  },
  welcome: {
    fontSize: 25,
  },
})
