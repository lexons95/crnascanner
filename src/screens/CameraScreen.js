import React, { useContext, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Button, Alert, Platform } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import { HeaderBackButton } from '@react-navigation/stack';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';
import { ReactNativeFile } from 'apollo-upload-client';

// import Swiper from 'react-native-swiper';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageZoomViewer from '../component/ImageZoomViewer';
// import CustomSwiper from './CustomSwiper';
import { COLOR } from '../constants/globalStyles';
import { useUploadReceiptMutation } from '../utils/ApolloAPI';
import { AuthContext } from '../utils/AuthContext';
import { checkMultiplePermissions, PERMISSIONS } from "../utils/permissions";

Icon.loadFont();

const iconSize = 30;
const cameraMode = {
  MULTI: "Multi",
  SINGLE: "Single"
}

const CameraScreen = ({ route, navigation }) => {
  const [ state ] = useContext(AuthContext);

  // const { onClose=null, onSubmit, isSubmitting=false } = props;
  const theCamera = useRef(null);
  const [ cameraPermission, setCameraPermission ] = useState(null);
  const [ cameraType, setCameraType ] = useState(RNCamera.Constants.Type.back);
  const [ cameraFlashMode, setCameraFlashMode ] = useState(RNCamera.Constants.FlashMode.off);

  const [ cameraSnapMode, setCameraSnapMode ] = useState(cameraMode.SINGLE);
  const [ selectedImages, setSelectedImages ] = useState([]);
  const [ currentImageIndex, setCurrentImageIndex ] = useState(null);
  const [ previewVisible, setPreviewVisible ] = useState(false);

  useEffect(() => {
      (async () => {
        const isPermissionGranted = await checkMultiplePermissions([PERMISSIONS.IOS.CAMERA])
        setCameraPermission(isPermissionGranted);
      })();
  }, []);

  let headerStyle = {};
  if (Platform.OS === 'android') {
    headerStyle['tintColor'] = "#fff"
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: (props) => {
        return (
          <HeaderBackButton
            {...props}
            onPress={() => {
              handleCloseCamera()
            }}
            {...headerStyle}
          />
        )
      },
      headerRight: (props) => (
        <TouchableOpacity
          activeOpacity={.4}
          //style={styles.cameraTypeButton}
          onPress={handleCameraFlashMode}
        >
          <Icon name={handleCameraFlashModeIcon()} size={iconSize} style={[styles.iconStyle, styles.cameraTypeIcon]} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: 'black',
        borderColor: 'black',
        shadowOpacity: 0,
        elevation: 0,
      },
    });
  }, [navigation,cameraFlashMode, selectedImages]);

  const [ uploadReceipt, { loading: isUploading } ] = useUploadReceiptMutation({
    onCompleted: (result) => {
      handleClosePreview();
      navigation.goBack();
    },
    onError: (err) => {
      Alert.alert(
        "Error Uploading",
        "",
        [
          { text: "OK", onPress: () => {} }
        ],
        { cancelable: false }
      );
    }
  })

  const handleCloseCamera = () => {
    // if (onClose) {
    //   onClose()
    //   handleClosePreview()
    // }
    handleAlertOnExit("",() => {
      navigation.goBack();
      handleClosePreview()  
    })
  }

  const handleCameraType = () => {
    if (cameraType == RNCamera.Constants.Type.back) {
      setCameraType(RNCamera.Constants.Type.front)
    }
    else {
      setCameraType(RNCamera.Constants.Type.back)
    }
  }

  const handleCameraFlashMode = () => {
    // off > on > auto > off
    if (cameraFlashMode == RNCamera.Constants.FlashMode.off) {
      setCameraFlashMode(RNCamera.Constants.FlashMode.on)
    }
    else if (cameraFlashMode == RNCamera.Constants.FlashMode.on) {
      setCameraFlashMode(RNCamera.Constants.FlashMode.auto)
    }
    else {
      setCameraFlashMode(RNCamera.Constants.FlashMode.off)
    }
  }

  const handleCameraFlashModeIcon = (mode=cameraFlashMode) => {
    let result = "flash-off";
    switch(mode) {
      case RNCamera.Constants.FlashMode.off:
        result = "flash-off";
        break;
      case RNCamera.Constants.FlashMode.on:
        result = "flash-on";
        break;
      case RNCamera.Constants.FlashMode.auto:
        result = "flash-auto";
        break;
    }
    return result
  }

  const handleImagePicker = async () => {
    const isPermissionGranted = await checkMultiplePermissions([PERMISSIONS.IOS.PHOTO_LIBRARY])

    const multiSelect = false;
    if (isPermissionGranted) {
      ImagePicker.openPicker({
        multiple: multiSelect
      }).then(images => {
        let result = [];
        if (!multiSelect) {
          result = [{
            sourceURL: images.sourceURL,
            mime: images.mime,
            filename: images.filename
          }]
        }
        else {
          result = images.map((anImage)=>{
            return {
              sourceURL: anImage.sourceURL,
              mime: anImage.mime,
              filename: anImage.filename
            }
          })
        }
        // [
        //   {
        //     "creationDate": "1522437259", 
        //     "cropRect": null,
        //     "data": null, 
        //     "duration": null, 
        //     "exif": null, 
        //     "filename": "IMG_0006.HEIC", 
        //     "height": 3024, 
        //     "localIdentifier": "CC95F08C-88C3-4012-9D6D-64A413D254B3/L0/001", 
        //     "mime": "image/jpeg", 
        //     "modificationDate": "1603685859", 
        //     "path": "/Users/hongjing/Library/Developer/CoreSimulator/Devices/9E291E60-6105-4EF8-92FE-E7808C8448D0/data/Containers/Data/Application/EA3AB71F-B5DC-451D-8EC7-563C9E9F69DE/tmp/react-native-image-crop-picker/738CC084-2457-4364-9CFE-111C3717DF65.jpg", 
        //     "size": 4126018, 
        //     "sourceURL": "file:///Users/hongjing/Library/Developer/CoreSimulator/Devices/9E291E60-6105-4EF8-92FE-E7808C8448D0/data/Media/DCIM/100APPLE/IMG_0006.HEIC", 
        //     "width": 4032
        //   }
        // ]
        setSelectedImages(result)
        handleOpenPreview(result)
      }).catch(err=>{
        console.log('ImagePicker err',err)
      });
      
    }
    else {
      Alert.alert(
        "No Permission to Photo library",
        "",
        [
          { text: "OK", onPress: () => {} }
        ],
        { cancelable: false }
      );
    }
  }

  const handleTakePhoto = async () => {
    if (theCamera) {
      const options = { 
        quality: 0.9, 
        base64: true 
      };
      const data = await theCamera.current.takePictureAsync(options)
      
      let filename = data.uri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let result = {
        sourceURL: data.uri,
        mime: type,
        filename: filename
      }
      if (cameraSnapMode == cameraMode.SINGLE) {
        setSelectedImages([result])
        handleOpenPreview([result])
      }
      else if (cameraSnapMode == cameraMode.MULTI) {
        setSelectedImages([...selectedImages, result])
      }
    }
  }

  const handleDeleteSelectedImage = (index) => {
    let dataSelected = selectedImages[index];
    let newArray = [...selectedImages]
    if (dataSelected) {
      newArray.splice(index, 1);
      setSelectedImages(newArray)
      if (newArray.length == 0) {
        handleClosePreview()
      }
      else {
        if (index <= newArray.length-1) {
          setCurrentImageIndex(index)
        }
        else {
          setCurrentImageIndex(index-1)
        }
      }
      
    }
  }

  const handleCameraMode = (mode) => {
    if (selectedImages && selectedImages.length > 0) {
      if (mode == cameraMode.SINGLE) {
        handleAlertOnExit("",() => {
          setSelectedImages([])
          setCurrentImageIndex(null)
          setCameraSnapMode(mode)   
        })
      }
    }
    else {
      setCameraSnapMode(mode)
    }
    
  }

  const handleAlertOnExit = (title, onConfirm) => {
    if (selectedImages && selectedImages.length > 0) {
      Alert.alert(
        "",
        "Discard Photos?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel"
          },
          { 
            text: "OK",
            onPress: onConfirm
          }
        ],
        { cancelable: false }
      );
    }
    else {
      onConfirm()
    }
  }

  const handleSubmit = (data=selectedImages) => {
    if (data.length > 0 && state.company != null && state.company.code) {
      let image = data[0];
      const theFile = new ReactNativeFile({
        uri: image.sourceURL,
        name: image.filename,
        type: image.mime
      });
      uploadReceipt({
        variables: {
          "file": theFile,
          "bucket": 'temp',
          "tenant_id": state.company.code,
          "total": 0
        }
      })
    }
    else {
      console.log('Data not completed')
    }
  }

  const handleOpenPreview = (data=selectedImages) => {
    setSelectedImages(data);
    setCurrentImageIndex(0);
    setPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setSelectedImages([])
    setCurrentImageIndex(null)
    setPreviewVisible(false);
  }

  const cameraHeader = () => {
    return (
      <View style={styles.cameraHeader}>
        <TouchableOpacity
          activeOpacity={.4}
          style={styles.cameraTypeButton}
          onPress={handleCameraFlashMode}
        >
          <Icon name={handleCameraFlashModeIcon()} size={iconSize} style={[styles.iconStyle, styles.cameraTypeIcon]} />
        </TouchableOpacity>
        <View>
          <Text>
            Header here
          </Text>
        </View>
        <TouchableOpacity
            activeOpacity={.4}
            style={styles.cameraTypeButton}
            onPress={handleCloseCamera}
          >
            <Icon name="close" size={iconSize} style={[styles.iconStyle, styles.cameraTypeIcon]} />
        </TouchableOpacity>
      </View>
    )
  }
  const cameraFooter = () => {

    return (
      <View style={styles.cameraFooter}>
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity
            activeOpacity={.4}
            onPress={handleImagePicker}
          >
            <Icon name="photo" size={iconSize} style={[styles.iconStyle, styles.cameraTypeIcon]} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={.4}
          style={[styles.cameraTypeButton,styles.captureButton]}
          onPress={handleTakePhoto}
        >
          {
            cameraSnapMode == cameraMode.MULTI && selectedImages.length > 0 ? <Text>{selectedImages.length}</Text> : null
          }
          {/* <Icon name="retweet" size={20} style={styles.cameraTypeIcon} /> */}
        </TouchableOpacity>
        <View style={styles.footerButtonContainer}>
          {
            selectedImages.length > 0 ? (
              <TouchableOpacity
                activeOpacity={.4}
                style={styles.footerReviewButton}
                onPress={()=>{handleOpenPreview()}}
              >
                <Text>Review</Text>
              </TouchableOpacity>
            ) : null
          }  
        </View>
      </View>
    )
  }

  let isActiveSingle = cameraSnapMode == cameraMode.SINGLE;

  if (cameraPermission == null) {
    return (
      <View style={[styles.container, {alignItems:'center', justifyContent: 'center'}]}>
        <Text>Loading</Text>
      </View>
    )
  }
  else if (!cameraPermission) {
    return (
      <View style={[styles.container, {alignItems:'center', justifyContent: 'center'}]}>
        <Text>No Permission to Camera! Go to Setting</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {
        previewVisible && currentImageIndex != null ? (
          <ImageZoomViewer 
            data={selectedImages}
            onDelete={handleDeleteSelectedImage}
            visible={previewVisible}
            onClose={handleClosePreview}
            currentIndex={currentImageIndex}
            setCurrentIndex={setCurrentImageIndex}
            actions={handleSubmit}
            loading={isUploading}
          /> 
        ) : null
      }
      {/* {cameraHeader()} */}
      <RNCamera
        ref={theCamera}
        style={styles.camera}
        captureAudio={false}
        type={cameraType}
        flashMode={cameraFlashMode}
      >
      <View style={styles.cameraMode}>
        {/* <Swiper 
          style={styles.wrapper} 
          showsButtons={false}
          loop={false}
          autoplay={false}
          renderPagination={(index, total, context)=>{
            let singleStyle = styles.cameraModeOption;
            let multiStyle = styles.cameraModeOption;
            if (cameraSnapMode == cameraMode.SINGLE) {
              singleStyle = [styles.cameraModeOption, styles.activeMode]
            }
            else {
              multiStyle = [styles.cameraModeOption, styles.activeMode]
            }
            return (
              <View style={styles.cameraModePagination}>
                <TouchableOpacity
                  activeOpacity={.4}
                  style={singleStyle}
                >
                  <Text style={singleStyle}>{cameraMode.SINGLE}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={.4}
                  style={multiStyle}
                >
                  <Text style={multiStyle}>{cameraMode.MULTI}</Text>
                </TouchableOpacity>
              </View>

            )
          }}
          onTouchEnd={(e, state, context)=>{
            let mode = state.index == 0 ? cameraMode.MULTI : cameraMode.SINGLE;
            handleCameraMode(mode)
            handleClosePreview()
          }}
        >
        </Swiper> */}

        <ToggleButton.Row onValueChange={value => handleCameraMode(value)} value={cameraSnapMode}>
          <ToggleButton 
            icon={({ size, color }) => {
              return (
                <Text style={isActiveSingle ? styles.activeMode : {color: 'white'}}>Single</Text>
              )
            }} 
            style={[styles.toggleButtonStyleSingle, isActiveSingle ? styles.activeMode : {}]} value={cameraMode.SINGLE} />
          <ToggleButton 
            icon={({ size, color }) => {
              return (
                <Text style={!isActiveSingle ? styles.activeMode : {color: 'white'}}>Multi</Text>
              )
            }} 
            style={[styles.toggleButtonStyleMulti, !isActiveSingle ? styles.activeMode : {}]} value={cameraMode.MULTI}/>
        </ToggleButton.Row>
      </View>
      </RNCamera>
      {cameraFooter()}
    </View>
  );
}
export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  camera: {
    flex: 7,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },

  cameraHeader: {
    backgroundColor: "#000",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  cameraFooter: {
    backgroundColor: "#000",
    //flex: 1,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  captureButton: {
    height: 60,
    width: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    borderColor: "#000",
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center"
  },

  footerButtonContainer: {
    width: 80
  },
  footerReviewButton: {
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5
  },
  iconStyle: {
    color: "#fff"
  },
  cameraTypeIcon: {
    marginRight: 15
  },
  cameraMode: {
    height: "100%",
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10
  },

  cameraModePagination: {
    backgroundColor: "#000", 
    height: 50,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: 'row'
  },
  cameraModeOption: {
    fontWeight: 'bold',
    borderRadius: 5,
    padding: 7,
    color: "#fff"
  },
  activeMode: {
    color: COLOR.PRIMARY,
    backgroundColor: 'black'
  },
  toggleButtonStyleSingle: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  toggleButtonStyleMulti: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 100,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  }
});
