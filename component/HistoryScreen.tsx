// ProfileScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../auth/authContext';

export default function UserScreen() {
  const { user, signOut } = useAuth();


  return (
    <View>
      <Text>Hist Screen</Text>
    </View>
  );
}
