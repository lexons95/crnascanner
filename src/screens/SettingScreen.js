import React, {useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import {AuthContext} from '../utils/AuthContext';
import LoadingComponent from '../component/LoadingComponent';

const SettingScreen = ({navigation}) => {
  const [ state, { signOut, checkUser } ] = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Text>
        User: {state && state.user ? state.user.username : "No User found"}
      </Text>
      <Button onPress={()=>{checkUser()}}>Check User</Button>
      <Button onPress={()=>{signOut()}}>Logout</Button>
      <Button onPress={()=>{navigation.navigate('RegisterScreen')}}>Register new Tenant</Button>
      
      <LoadingComponent show={state.isLoading}/>
    </View>
  )
}

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});