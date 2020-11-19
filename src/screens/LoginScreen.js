import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { AuthContext } from '../utils/AuthContext';

import LoadingComponent from '../component/LoadingComponent';
import { COLOR, globalStyles } from '../constants/globalStyles';

const LoginScreen = ({navigation}) => {
  const [state, {signIn}] = useContext(AuthContext);

  // const [ username, setUsername ] = useState('');
  // const [ password, setPassword ] = useState('');
  // const [ username, setUsername ] = useState('system');
  const [ password, setPassword ] = useState('password');
  const [ username, setUsername ] = useState('afk@hotmail.com');


  const onSubmit = () => {
    signIn({
      username: username,
      password: password
    })
  };

  return (
    <View style={styles.container}>
      <TextInput
        //mode="outlined"
        label="Email"
        value={username}
        placeholder={"Email"}
        onChangeText={text => setUsername(text)}
        style={[styles.item, styles.fieldStyle]}
      />
      <TextInput
        //mode="outlined"
        label="Password"
        value={password}
        placeholder={"Password"}
        onChangeText={text => setPassword(text)}
        secureTextEntry={true}
        style={[styles.item, styles.fieldStyle]}
      />
      <Button mode="contained" onPress={onSubmit} style={styles.item}>
        Sign In
      </Button>
      <Text style={[styles.item, styles.texts]}>OR</Text>
      <Button mode="outlined" onPress={()=>{navigation.navigate("RegisterScreen")}} style={styles.item}>
        Sign Up
      </Button>
      <LoadingComponent show={state.isLoading}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLOR.WHITE,
  },
  formContainer: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  fieldStyle: {
    ...globalStyles.fieldInputStyle
  },
  item: {
    marginBottom: 10,
  },
  texts: {
    textAlign: 'center'
  },
  submitButton: {
  }
})
export default LoginScreen;