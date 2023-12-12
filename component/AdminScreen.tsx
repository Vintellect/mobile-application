// ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal } from 'react-native';
import { useAuth } from '../auth/authContext';
import NewWineForm from './NewWineForm';

export default function AdminScreen() {
  const { user } = useAuth();
  const [addWine, setAddWine] = useState(false);

  const closeModal = () => {
    setAddWine(false);
  };

  return (
    <View style={styles.container}>
      {addWine ? <View style={styles.container}>
        <NewWineForm />
        <View style={styles.closeButtonContainer}>
          <Button title="Close" onPress={closeModal} />
        </View>
      </View> :
        <View>
          <Text>Admin Screen</Text>
          <Text>Welcome in the admin dashboard {user ? user.displayName : ''} !</Text>
          <Button title="Add Wine" onPress={() => setAddWine(true)} />
        </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
  },
  closeButtonContainer: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    backgroundColor: "white",
  },
});