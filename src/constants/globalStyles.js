import { StyleSheet } from 'react-native';

export const COLOR = {
  PRIMARY: "#0f66f1",
  SECONDARY: "#f1c40f",
  BLACK: "#000000",
  WHITE: "#FFFFFF",
  GRAY: "#808080"
}

export const globalStyles = StyleSheet.create({
  headerButtonLeft: {
    paddingLeft: 20
  },
  headerButtonRight: {
    paddingRight: 20
  },
  bgColorWhite: {
    backgroundColor: COLOR.WHITE
  },
  bgColorDefault: {
    backgroundColor: COLOR.GRAY
  },
  bgColorPrimary: {
    backgroundColor: COLOR.PRIMARY
  },
  itemShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  fieldInputStyle: {
    height: 55,
    padding: 10,
    backgroundColor: COLOR.WHITE,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 1,
    elevation: 3
  }


});