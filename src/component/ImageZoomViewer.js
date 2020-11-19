import React, { useEffect } from 'react';
import { 
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Button} from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';

import LoadingComponent from './LoadingComponent';


Icon.loadFont();

const ImageZoomViewer = (props) => {
  const { data, onDelete, onClose, visible, setCurrentIndex, currentIndex, actions, loading=false } = props 

  let imageUrls = data.map((anImage)=>{
    if (anImage.url) {
      return anImage
    }
    return {
      url: anImage.sourceURL
    }
  });

  let currentData = data[currentIndex];
  let name = currentData ? currentData.createdAt : null;

  const handleClose = () => {
    onClose()
  }
  const handleDelete = () => {
    onDelete(currentIndex);
  }
  const handleOnChange = (index) => {
    setCurrentIndex(index)
  }

  const modalHeader = () => (
      <View style={styles.modalHeader}>
        <View style={[styles.headerItem, styles.left]}>
          {
            onDelete ? (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.deleteButtonStyle}
                onPress={handleDelete}
              >
                <Icon name="delete" size={25} style={styles.closeIcon} />
              </TouchableOpacity>
            ) : null
          }
        </View>
        <View style={[styles.headerItem, styles.center]}>
          {
            data && data.length > 0 ? data.length > 1 ? <Text>{currentIndex+1}/{data.length}</Text> : null : null
          }
          {
            name ? <Text>{name}</Text> : null
          }
        </View>
        <View style={[styles.headerItem, styles.right]}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.closeButtonStyle}
            onPress={handleClose}>
            <Icon name="close" size={25} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
      </View>
  )

  const modalFooter = () => {
    if (actions) {
      return (
        <View style={styles.modalFooter}>
          <Button mode="contained" onPress={()=>{actions()}} loading={loading} disabled={loading}>{loading ? "Uploading": "Upload"}</Button>
        </View>
      )
    }
    return null
  }

  let imageViewerProps = {}
  if (setCurrentIndex) {
    imageViewerProps['onChange'] = handleOnChange
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        //transparent={true}
        animationType={'fade'}
        visible={visible}
        onRequestClose={handleClose}
      >
        {modalHeader()}
        <ImageViewer 
          index={currentIndex}
          imageUrls={imageUrls}
          renderIndicator={()=>{return null}}
          onCancel={handleClose}
          enableSwipeDown={true}
          backgroundColor="white"
          menus={null}
          //renderHeader={header}
          //renderFooter={footer}
          loadingRender={()=>{
            return (<LoadingComponent/>)
          }}
          {...imageViewerProps}
        />
        {modalFooter()}
        <LoadingComponent show={loading}/>
      </Modal>

    </SafeAreaView>
  )
}

export default ImageZoomViewer;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  modalHeader: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    height: 95,
    // alignItems: "flex-end",
    // justifyContent: "flex-end",
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "flex-end"
  },
  headerItem: {
    // borderWidth: 1
  },
  left: {
    width: 60,
    paddingHorizontal: 10,
    alignItems: 'center'

  },
  center: {
    flexGrow: 1,
    alignItems: 'center'
  },
  right: {
    width: 60,
    paddingHorizontal: 10,
    alignItems: 'center'

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
  modalFooter: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: "center",
    alignItems: 'center',
    height: 100,
    width: "100%",
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    zIndex: 1,
  }
});