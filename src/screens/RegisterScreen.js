import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { COLOR, globalStyles } from '../constants/globalStyles';
import {AuthContext} from '../utils/AuthContext';

const RegisterScreen = ({navigation}) => {
  const [ state, { signUp } ] = useContext(AuthContext);

  const [ formValue, setFormValue ] = useState({
    code: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactPerson: ""
  })

  const handleUpdateFormValue = (fieldKey, value) => {
    setFormValue({
      ...formValue,
      [fieldKey]: value
    })
  }

  const onSubmit = () => {
    const { confirmPassword, ...restValue } = formValue;
    signUp(restValue)
  };

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        label="Name"
        placeholder={"Name"}
        value={formValue['name']}
        onChangeText={text => handleUpdateFormValue("name", text)}
        style={[styles.item, styles.fieldStyle]}
      />
      <TextInput
        mode="outlined"
        label="Contact"
        placeholder={"Contact"}
        value={formValue['contactPerson']}
        onChangeText={text => handleUpdateFormValue("contactPerson", text)}
        style={[styles.item, styles.fieldStyle]}
      />
      <TextInput
        mode="outlined"
        label="Email"
        placeholder={"Email"}
        value={formValue['email']}
        onChangeText={text => handleUpdateFormValue("email", text)}
        style={[styles.item, styles.fieldStyle]}
      />
      <TextInput
        mode="outlined"
        label="Password"
        placeholder={"Password"}
        value={formValue['password']}
        onChangeText={text => handleUpdateFormValue("password", text)}
        secureTextEntry={true}
        style={[styles.item, styles.fieldStyle]}
      />
      <TextInput
        mode="outlined"
        label="Confirm Password"
        placeholder={"Confirm Password"}
        value={formValue['confirmPassword']}
        onChangeText={text => handleUpdateFormValue("confirmPassword", text)}
        secureTextEntry={true}
        style={[styles.item, styles.fieldStyle]}
      />
      <Button mode="contained" onPress={onSubmit} style={styles.item}>
        Confirm
      </Button>
      <Text style={[styles.item, styles.texts]}>OR</Text>
      <Button mode="outlined" onPress={()=>{navigation.navigate("LoginScreen")}} style={styles.item}>
        Sign In
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLOR.WHITE
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
export default RegisterScreen;