import React, { useState, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, RefreshControl } from 'react-native';

import ReceiptListItem from '../component/ReceiptListItem';

import { COLOR } from '../constants/globalStyles';

const TabClosedScreen = (props) => {
  const { navigation, listData=[], refetchListData=null, refreshControl } = props;

  let dataSource = listData;

  const handleOnItemEdit = (data) => {
    navigation.navigate("EditScreen",{ data: data, status: "CLOSED" })
  }
  
  const emptyList = (
    <View style={styles.emptyContainer}>
      <Text>No Data</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dataSource}
        renderItem={({item}) => <ReceiptListItem data={item} onPress={handleOnItemEdit} />}
        keyExtractor={(item, index) => item + index}
        refreshControl={refreshControl}
        ListEmptyComponent={emptyList}
        contentContainerStyle={dataSource.length === 0 && styles.flatListStyle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    //marginHorizontal: 16,
    backgroundColor: COLOR.WHITE
  },
  flatListStyle: {
    justifyContent: "center",
    height: "100%"
  },
  emptyContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
})

export default TabClosedScreen;