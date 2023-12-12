import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import LoginScreen from './component/LoginScreen';
import UserScreen from './component/UserScreen';
import CameraScreen from './component/CameraScreen'; 
import HistoryScreen from './component/HistoryScreen';
import AdminScreen from './component/AdminScreen';
import WineList from './component/WineList';
import { useAuth, AuthProvider } from './auth/authContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

/**
 * HERE TO REMOVE WARNING IN EXPO APP
 */
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppContent({ navigation }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return null; // You can add a loading indicator here if needed
  }

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator initialRouteName="Camera">
          <Tab.Screen
            name="Profile"
            component={UserScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Camera"
            component={CameraScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="camera" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Wine Search"
            component={WineList}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Foundation name="magnifying-glass" size={size} color={color} />
              ),
            }}
          />
          { isAdmin ? 
          <Tab.Screen
          name="ADMIN"
          component={AdminScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="admin-panel-settings"  size={size} color={color} />
            ),
          }}
        /> : null}
        </Tab.Navigator>
        
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  );
}