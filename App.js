import 'react-native-gesture-handler';

import React, { useContext } from 'react';
import {
  SafeAreaView, View, Text
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { RetryLink } from '@apollo/client/link/retry';

import { createUploadLink } from 'apollo-upload-client';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {API_URL} from "react-native-dotenv"
// import {API_URL} from "@env";

import CompanyListScreen from './src/screens/CompanyListScreen';
import DataTabsScreen from './src/screens/DataTabsScreen';
import CameraScreen from './src/screens/CameraScreen';
import EditScreen from './src/screens/EditScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SettingScreen from './src/screens/SettingScreen';
import SplashScreen from './src/screens/SplashScreen';


import AuthContextProvider, { AuthContext } from './src/utils/AuthContext';
import { COLOR } from './src/constants/globalStyles';

Icon.loadFont();

const API_URL = 'http://graphql.lollipoplab.io:4000/graphql'
const uploadLink = createUploadLink({
  uri: API_URL,
  credentials: "include"
});

const batchHttpLink = new BatchHttpLink({ uri: API_URL, headers: { batch: "true " }, credentials: "include" });

const link = new RetryLink().split(
  operation => operation.getContext().important === true,
  batchHttpLink,
  uploadLink,
)
const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          receipts: {
            merge(existing, incoming){
              return incoming
            }
          }
        }
      }
    }
  }),
  link: uploadLink
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppScreens = () => {
  
  const [state] = useContext(AuthContext);

  const HomeStack = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'CompanyListScreen') {
              iconName = 'people'
            } else if (route.name === 'SettingScreen') {
              iconName = 'settings';
            }

            // You can return any component that you like here!
            return <Icon name={iconName} size={20}  />;
          },
        })}
        tabBarOptions={{
          activeTintColor: COLOR.PRIMARY,
          inactiveTintColor: COLOR.GRAY,
        }}
      >
        <Tab.Screen name="CompanyListScreen" options={{ title: 'Clients' }} component={CompanyListScreen} />
        <Tab.Screen name="SettingScreen" options={{ title: 'Settings' }} component={SettingScreen} />
      </Tab.Navigator>
    )
  }
  const theme = {
    ...DefaultTheme,
    settings:{
        icon: props => <MaterialCommunityIcons {...props} />,
    },
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: COLOR.PRIMARY,
      accent: COLOR.SECONDARY,
    },
  };

  return (
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            {
              state.isLoading ? (
                <Stack.Screen name="SplashScreen" options={{ headerShown: false }}  component={SplashScreen} />
              ) : null
            }
            {
              state.user == null && state.tenant == null ? (
                <>
                  <Stack.Screen name="LoginScreen" options={{ title: 'Sign In' }} component={LoginScreen} />
                  <Stack.Screen name="RegisterScreen" options={{ title: 'Sign Up' }} component={RegisterScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name="HomeScreen"
                    component={HomeStack}
                    options={{ title: 'Home', headerShown: true }}
                  />
                  <Stack.Screen name="DataTabsScreen" options={{ title: 'Data Tabs' }} component={DataTabsScreen} />
                  <Stack.Screen name="CameraScreen" options={{ title: 'On Camera', headerShown: true }} component={CameraScreen} />
                  <Stack.Screen name="EditScreen" options={{ title: 'Editing' }} component={EditScreen} />
                  <Stack.Screen name="RegisterScreen" options={{ title: 'Sign Up' }} component={RegisterScreen} />

                </>
              )
            }

          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
  )
}
export default function App() {

  return (
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <AppScreens/>
     </AuthContextProvider>
    </ApolloProvider>
  )
}

/*
packages need to be setup for android
react-native-camera
react-native-image-crop-picker
*/