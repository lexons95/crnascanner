import React, { useCallback } from 'react';
import { Button, Text, SafeAreaView, View, FlatList, RefreshControl, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLOR } from '../constants/globalStyles';
Icon.loadFont();

const constantHeight = 60;
const constantBorderRadius = 10;

const ListItem2 = (props) => {
  const { data, onPress } = props;
  let status = "default"; // default (white), red/orange (require to edit)

  let needEdit = false;
  let itemStyle = styles.itemContent;
  if (needEdit) {
    itemStyle = {
      ...styles.itemContent, 
      ...styles.statusWarning
    }
  }
  return (
    <List.Item
      title={data.name}
      //description={data.code}
      onPress={()=>{onPress(data)}}
      style={styles.listItem}
      //left={props => <List.Icon {...props} icon="folder" />}
    />
  )
  // return (
  //   <View style={styles.listItem}>
  //     <TouchableOpacity style={itemStyle} onPress={()=>{onPress(data)}}>
  //       <Text>
  //         {data.title}
  //       </Text>
  //     </TouchableOpacity>
  //   </View>
  // )
  // return (
  //   <ListItem>
  //     <Text>
  //       {data.title}
  //     </Text>
  //   </ListItem>
  // )
}

const ListContainer = (props) => {
  const { data, refreshing, onRefresh, onPress } = props;

  let listProps = {}
  if (onRefresh && refreshing != undefined) {
    listProps['refreshControl'] = <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) => <ListItem2 data={item} onPress={onPress}/>}
        keyExtractor={(item, index) => item + index}
        {...listProps}
      />
    </SafeAreaView>
  );
}

export default ListContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    //marginHorizontal: 16
  },
  listItem2: {
    backgroundColor: "#fff",
    height: constantHeight,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  listItem: {
    backgroundColor: COLOR.WHITE,
    marginTop: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  statusWarning: {
    backgroundColor: "#FFD081"
  }
})