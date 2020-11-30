import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Modal, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '../constants/globalStyles';

const RNDateTimePicker = (props) => {
  const { value, onChange, placeholder="Select a Date" } = props;
  const [ show, setShow ] = useState(false);
  const [ mode, setMode ] = useState('date');
  const [ selectedValue, setSelectedValue ] = useState(value);

  const handleOpenPicker = () => {
    setShow(true)
  }
  const handleClosePicker = () => {
    setShow(false)
  }
  const handleOnChange = (event, date) => {
    setSelectedValue(date)
    if (Platform.OS === 'android') {
      if (onChange && date) {
        onChange(date)
      }
      handleClosePicker();
    }
  }

  const handleOnFinish = () => {
    handleClosePicker();
    if (onChange) {
      onChange(selectedValue)
    }
  }

  return (
    <View>
      <TouchableWithoutFeedback onPress={()=>{handleOpenPicker()}}>
        <View style={styles.fieldStyle}>
          <Text>{value ? value.toISOString().split("T")[0] : placeholder}</Text>
        </View>
      </TouchableWithoutFeedback>
      {
        Platform.OS === 'android' ? (
          show ? 
          <DateTimePicker
            testID="dateTimePicker"
            value={selectedValue ? selectedValue : new Date()}
            mode={mode}
            is24Hour={true}
            display="default"
            //maximumDate={new Date().toISOString().split("T")[0]}
            onChange={handleOnChange}
          /> : null
        ) : (
          <Modal
            visible={show}
            transparent={true}
            animationType={"fade"}
          >
            <View style={styles.pickerContainer}>
              <View style={styles.modalView}>
                <View style={styles.buttonContainer}>
                  <Button onPress={handleClosePicker}>Close</Button>
                  <Button onPress={handleOnFinish}>Confirm</Button>
                </View>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={selectedValue}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  //maximumDate={new Date().toISOString().split("T")[0]}
                  onChange={handleOnChange}
                />

              </View>
            </View>
          </Modal>
        )
      }

    </View>
  )
}

export default RNDateTimePicker;

const styles = StyleSheet.create({
  fieldStyle: {
    justifyContent: 'center',
    ...globalStyles.fieldInputStyle
  },
  pickerContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    // position: 'absolute',
    // zIndex: 1000,
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    // elevation: 9
    //height: 200,
    //width: 200
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    margin: 20,
    backgroundColor: "white",
    //borderRadius: 20,
    //padding: 35,
    //alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 10

  }
});