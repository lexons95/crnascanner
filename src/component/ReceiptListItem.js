import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight, TouchableOpacity, SafeAreaView, SectionList, FlatList, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { List } from 'react-native-paper';

import { COLOR } from '../constants/globalStyles';

const constantHeight = 60;
const constantBorderRadius = 10;

const ReceiptListItem = (props) => {
  const { data, onPress } = props;
  const { 
    receiptDate=null,
    receiptCurrency=null,
    total=null,
    supplier_label=null
  } = data;

  let description = `${receiptCurrency ? receiptCurrency : "MYR"} ${total ? total : "-"}`
  
  let status = "default"; // default (white), red/orange (require to edit)

  let needEdit = false;
  let itemStyle = styles.itemContent;
  if (needEdit) {
    itemStyle = {
      ...styles.itemContent, 
      ...styles.statusWarning
    }
  }

  const handleOnPress = () => {
    onPress(data)
  }
  return (
     <List.Item
      title={supplier_label ? supplier_label : "-"}
      description={description}
      onPress={handleOnPress}
      style={styles.listItem}
      right={props => {
        return (
          <View style={{alignItems:'center'}}>
            <Text>{receiptDate ? (new Date(receiptDate)).toDateString() : "-"}</Text>
          </View>
        )
      }}
    />
  )
};

export default ReceiptListItem;


const styles = StyleSheet.create({
  listItem: {
    backgroundColor: COLOR.WHITE,
    marginTop: 2,
    // borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  itemContent: {
    width: "100%",
    fontSize: 18,
    height: constantHeight,
    flex: 1,
    paddingLeft: 10,
    borderTopLeftRadius: constantBorderRadius,
    borderBottomLeftRadius: constantBorderRadius,
    display: "flex",
    justifyContent: "center"
  },

  statusWarning: {
    backgroundColor: "#FFD081"
  }
})