import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut  } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export  { auth };

export async function signUp(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: displayName });
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}


export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User connected successfully")
    const dataToStore = [
      ['token', userCredential.user.stsTokenManager.accessToken],
      ['uid', userCredential.user.uid],
    ];

    AsyncStorage.multiSet(dataToStore)
    .then(() => {
      console.log('Data stored successfully.' + userCredential.user.uid);
    })
    .catch((error) => {
      console.error('Error storing data:', error);
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
}


export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
}