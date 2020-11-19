import React, {useRef} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import globalStyles from '../constants/globalStyles';
Icon.loadFont();
const HomeScreen = ({ navigation }) => {

  return (
      <View style={styles.container}>
        {/* <TouchableOpacity
            activeOpacity={.4}
            style={styles.cameraButton}
            onPress={() =>
              navigation.navigate('CameraScreen')
            }
          >
          <Icon name="camera" size={50} style={styles.cameraIcon} />
        </TouchableOpacity> */}
        {/* <Button title={"View Data"} onPress={() =>
          navigation.navigate('DataScreen')
        } /> */}
        <TouchableOpacity
            activeOpacity={.4}
            style={styles.cameraButton}
            onPress={() =>
              navigation.navigate('CompanyListScreen')
            }
          >
          <Icon name="list" size={50} style={styles.cameraIcon} />
        </TouchableOpacity>
        <TouchableOpacity
            activeOpacity={.4}
            style={styles.cameraButton}
            onPress={() =>
              navigation.navigate('LoginScreen')
            }
          >
          <Icon name="user" size={50} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    height: 120,
    width: 120,
    marginBottom: 20,
    borderColor: '#000',
    borderRadius: 60,
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  cameraIcon: {
    textAlign: 'center'
  },
  userIcon: {
    // marginLeft: 15
  },
});

export default HomeScreen;