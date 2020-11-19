import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  RefreshControl,
  Alert,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useDeleteReceiptMutation } from '../utils/ApolloAPI';
import ImageZoomViewer from '../component/ImageZoomViewer';
import {AuthContext} from '../utils/AuthContext';

Icon.loadFont();

const TabProcessingScreen = (props) => {
  const [ state ] = useContext(AuthContext);
  const { listData=[], refetchListData=null, refreshControl } = props;

  // filter listdata here
  let dataSource = listData;

  const [ currentImageIndex, setCurrentImageIndex ] = useState(null);
  const [ modalVisibleStatus, setModalVisibleStatus ] = useState(false);

  const [ deleteReceipt, { loading: isDeletingReceipt } ] = useDeleteReceiptMutation({
    onCompleted: (result) => {
      if (result && result.deleteReceipt) {
        refetchListData()
      }
      handleCloseModal()
    },
    error: (err) => {
      console.log("deleteReceipt err", err)
      handleCloseModal()
    }
  })

  const handleOpenModal = (index) => {
    setCurrentImageIndex(index)
    setModalVisibleStatus(true);
  };

  const handleCloseModal = () => {
    setCurrentImageIndex(null)
    setModalVisibleStatus(false);
  }

  const handleDelete = (index) => {
    let dataSelected = dataSource[index];
    if (dataSelected) {
      Alert.alert(
        "Confirm Delete?",
        `${dataSelected.originalFilename}`,
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel"
          },
          { text: "OK", onPress: () => {
            deleteReceipt({
              variables: {
                id: dataSelected.id,
                updateCtr: dataSelected.updateCtr
              }
            })
          } }
        ],
        { cancelable: false }
      );
    }
  }

  const emptyList = (
    <View style={styles.emptyContainer}>
      <Text>No Data</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {modalVisibleStatus && currentImageIndex != null ? (
        <ImageZoomViewer 
          data={dataSource}
          onDelete={handleDelete}
          onClose={handleCloseModal}
          visible={modalVisibleStatus}
          setCurrentIndex={setCurrentImageIndex}
          currentIndex={currentImageIndex}
        />
        
      ) : (
        <View style={styles.container}>
          <FlatList
            data={dataSource}
            renderItem={({item, index}) => (
              <View style={styles.imageContainerStyle}>
                <TouchableOpacity
                  key={item.id}
                  style={{flex: 1}}
                  onPress={() => {
                    handleOpenModal(index);
                  }}>
                  <Image
                    style={styles.imageStyle}
                    source={{
                      uri: item.url,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={refreshControl}
            ListEmptyComponent={emptyList}
            contentContainerStyle={dataSource.length === 0 && styles.flatListStyle}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default TabProcessingScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  titleStyle: {
    padding: 16,
    fontSize: 20,
    color: 'white',
    backgroundColor: 'green',
  },
  imageContainerStyle: {
    // flex: 1,
    flexBasis: "33%",
    flexDirection: 'column',
    margin: 1.5,
    aspectRatio:1,
    // borderWidth: 1,
    //justifyContent: "center"
  },
  imageStyle: {
    height: "100%",
    width: '100%',
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    //backgroundColor: 'green',
    height: 150,
    // alignItems: "flex-end",
    // justifyContent: "flex-end",
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1
  },
  deleteButtonStyle: {
    // width: 25,
    // height: 25,
    // top: 50,
    // left: 30,
    // position: 'absolute'
  },
  closeButtonStyle: {
    // width: 25,
    // height: 25,
    // top: 50,
    // right: 20,
    // position: 'absolute'
  },
  closeIcon: {
    //color: "white"
  },

  flatListStyle: {
    justifyContent: "center",
    height: "100%"
  },
  flatListStyle2: {
  },
  emptyContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
});