import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { SafeAreaView, ScrollView, View, Image, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { TextInput as TextInput2, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';

// import RNPickerSelect from '../component/RNPickerSelect/RNPickerSelect';
import ImageZoomViewer from '../component/ImageZoomViewer';
import LoadingComponent from '../component/LoadingComponent';

import { AuthContext } from '../utils/AuthContext';
import { useUpdateReceiptMutation, useDeleteReceiptMutation, useListsQuery, useChangeStateReceiptMutation } from '../utils/ApolloAPI';
import { COLOR, globalStyles } from '../constants/globalStyles';

Icon.loadFont();

const EditScreen = ({ route, navigation }) => {
  // const [ state ] = useContext(AuthContext);

  const [ selectedImages, setSelectedImages ] = useState([]);
  const [ currentImageIndex, setCurrentImageIndex ] = useState(null);
  const [ previewVisible, setPreviewVisible ] = useState(false);

  const [ formValue, setFormValue ] = useState({});
  // const [ categoryOptions, setCategoryOptions ] = useState([]);
  // const [ currencyOptions, setCurrencyOptions ] = useState([]);

  const handleUpdateFormValue = (fieldKey, value) => {
    setFormValue({
      ...formValue,
      [fieldKey]: value
    })
  }
  const currentData = route.params && route.params['data'] ? route.params['data'] : null;
  const currentStatus = route.params && route.params['status'] ? route.params['status'] : null;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.deleteButtonStyle}
          onPress={handleDelete}
        >
          <Icon name="delete" size={25} style={styles.closeIcon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation,currentData]);

  useEffect(()=>{
    if (currentData) {
      setFormValue({
        receiptDate: currentData['createdAt'],
        supplier_id: currentData['supplier_id'],
        receiptCategory: currentData['receiptCategory'],
        total: currentData['total'],
        receiptCurrency: currentData['receiptCurrency'],
        description: currentData['description'],
        id: currentData['id'],
        updateCtr: currentData['updateCtr']
      })
    }

    if (currentData != null) {
      setSelectedImages([currentData])
    }
  },[currentData]);

  const { data: categoryListData, error: categoryListError, loading: categoryListLoading } = useListsQuery({
    variables: {
      filter: {
        where: {
          listGroup_id: "RECEIPT_CATEGORY"
        }
      }
    },
    onCompleted: (result) => {
      // if (result.lists) {
      //   let options = result.lists.map((anItem)=>{
      //     return {
      //       key: anItem.value,
      //       label: anItem._label,
      //       value: anItem.value
      //     }
      //   })
      //   setCategoryOptions(options)
      // }
    }
  });

  let categoryOptions = categoryListData && categoryListData.lists ? categoryListData.lists.map((anItem)=>{
      return {
        key: anItem.value,
        label: anItem._label,
        value: anItem.value
      }
    }) : []

  const { data: currencyListData, error: currencyListError, loading: currencyListLoading } = useListsQuery({
    variables: {
      filter: {
        where: {
          listGroup_id: "RECEIPT_CURRENCY"
        }
      }
    },
    onCompleted: (result) => {
      // if (result.lists) {
      //   let options = result.lists.map((anItem)=>{
      //     return {
      //       key: anItem.value,
      //       label: anItem._label,
      //       value: anItem.value
      //     }
      //   })
      //   setCurrencyOptions(options)
      // }
    }
  });

  let currencyOptions = currencyListData && currencyListData.lists ? currencyListData.lists.map((anItem)=>{
    return {
      key: anItem.value,
      label: anItem._label,
      value: anItem.value
    }
  }) : []

  const [ updateReceipt, { loading: updatingReceipt } ] = useUpdateReceiptMutation({
    onCompleted: (result) => {
      navigation.goBack();
    }
  });

  const [ changeStateReceipt, { loading: changeStateReceiptLoading } ] = useChangeStateReceiptMutation({
    onCompleted: (result) => {
      console.log('changeStateReceipt result',result)
      navigation.goBack();
    }
  });

  const [ deleteReceipt, { loading: deletingReceipt } ] = useDeleteReceiptMutation({
    onCompleted: (result) => {
      console.log("deleteReceipt",result)
      if (result && result.deleteReceipt) {
        // route.params.refetchListData();
        navigation.goBack();
      }
    },
    error: (err) => {
      console.log("deleteReceipt err", err.graphQLErrors)
    }
  })
  // {
  //   "__typename": "Receipt", 
  //   "_label": "https://storage.googleapis.com/upload-lollipoplab/temp/755a3959-2a39-4565-8e83-5aa806bf748b.jpg", 
  //   "bucket": "temp", 
  //   "createdAt": "2020-11-09T08:42:09.842Z", 
  //   "createdBy_id": "afk@hotmail.com", 
  //   "createdBy_label": "afk@hotmail.com", 
  //   "encoding": "7bit", "filename": 
  //   "temp/755a3959-2a39-4565-8e83-5aa806bf748b.jpg", 
  //   "id": "755a3959-2a39-4565-8e83-5aa806bf748b", 
  //   "mimetype": "image/jpeg", 
  //   "originalFilename": "FEE248A3-15B2-4104-868A-663BD167FD50.jpg", 
  //   "receiptCategory_label": null, 
  //   "receiptCurrency_label": null, 
  //   "status": "A", 
  //   "status_label": "Active", 
  //   "supplier_label": null, 
  //   "tenant_id": "CLIENTA123", 
  //   "tenant_label": "Client A", 
  //   "updateCtr": 0, 
  //   "updatedAt": "2020-11-09T08:42:09.842Z", 
  //   "updatedBy_id": "afk@hotmail.com", 
  //   "updatedBy_label": "afk@hotmail.com", 
  //   "url": "https://storage.googleapis.com/upload-lollipoplab/temp/755a3959-2a39-4565-8e83-5aa806bf748b.jpg"
  // }

  /*
  Receipt ID *	
  Type *
  Date *
  Due Date	
  Invoice Number
  Supplier *
  Category *
  Customer	
  Project	
  Payment Method	
  Bank Account	
  Tax	
  Total *
  Currency *
  Tax (USD)	
  Total (USD)	
  Status	
  Note	
  Description
  */

  const handleOpenPreview = (data=selectedImages) => {
    // setSelectedImages(data);
    setCurrentImageIndex(0);
    setPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setCurrentImageIndex(null);
    setPreviewVisible(false);
  }

  const handleDelete = () => {
    Alert.alert(
      "",
      "Confirm Delete?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          deleteReceipt({
            variables: {
              id: currentData['id'],
              updateCtr: currentData['updateCtr']
            }
          })
        } }
      ],
      { cancelable: false }
    );

  }

  const handleOnSubmit = () => {
    const handleReplaceValue = (obj, from=undefined, to="", remove=false) => {
      let keys = Object.keys(obj);
      let result = Object.assign({},obj)
      keys.forEach((aKey)=>{
        if (result[aKey] === from) {
          result[aKey] = to;
        }
      });
      return result;
    }

    let datetime = new Date(formValue["receiptDate"]);
    let result = {
      //...handleReplaceValue(formValue),
      receiptDate: datetime.toISOString(),
      receiptCategory: formValue["receiptCategory"],
      total: parseFloat(formValue["total"]),
      receiptCurrency: formValue["receiptCurrency"],
      description: formValue["description"],
      id: formValue.id,
      updateCtr: formValue.updateCtr
    }
    updateReceipt({
      variables: result
    })
  }

  const handleChangeStateReceipt = () => {
    let newState = "PENDING";
    if (currentStatus == "COMPLETED") {
      newState = "COMPLETED"
    }
    Alert.alert(
      "",
      "Confirm Move?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          changeStateReceipt({
            variables: {
              id: currentData.id,
              updateCtr: currentData.updateCtr,
              fromState: currentData.status,
              toState: newState
            }
          })
        } }
      ],
      { cancelable: false }
    );

  }
  /*
  C (Closed)
  PENDING
  COMPLETED
  FAILED
  */

  if (!currentData) {
    return (
      <View>
        <Text>No Data Found</Text>
      </View>
    )
  }

  let pickerFieldStyle = {
    viewContainer: {
      //marginBottom: 10,
      // backgroundColor: COLOR.WHITE,
      // height: 50,
      // borderColor: COLOR.GRAY,
      // borderWidth: 1,
      // padding: 10,
      // borderRadius: 5,
      justifyContent: 'center',
      ...globalStyles.fieldInputStyle,
    },
    inputAndroid: {
      color: '#000'
    }
  }
  let imageURL = currentData ? currentData.url : "";

  if (!(!categoryListLoading && !currencyListLoading)) {
    return (<LoadingComponent/>)
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* {
          selectedImages && selectedImages.length > 0 && previewVisible ? 
          <ImageZoomViewer 
            data={selectedImages}
            visible={previewVisible}
            onClose={handleClosePreview}
            currentIndex={currentImageIndex}
            setCurrentIndex={setCurrentImageIndex}
          /> : null 
        } */}
        <ImageZoomViewer 
            data={selectedImages}
            visible={previewVisible}
            onClose={handleClosePreview}
            currentIndex={currentImageIndex}
            setCurrentIndex={setCurrentImageIndex}
          />
        {
          currentData && currentData.url ? (
            <View style={styles.imageContainer}>
              <Image source={{uri: imageURL}} style={{width: "100%", flex: 1}} loadingIndicatorSource={<LoadingComponent/>}/>
              <TouchableOpacity
                style={styles.zoomButton}
                onPress={()=>{handleOpenPreview()}}
              >
                <MaterialCommunityIcons size={25} name="arrow-expand"/>
              </TouchableOpacity>
            </View>
          ) : null
        }
        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            {/* <Text style={styles.fieldLabel}>Supplier</Text> */}
            <TextInput
              mode="outlined"
              label="Supplier"
              placeholder="Supplier"
              value={formValue['supplier_id']}
              onChangeText={text => handleUpdateFormValue('supplier_id', text)}
              style={[styles.fieldStyle, styles.supplierField]}
              editable={false}
            />
          </View>
          <View style={styles.fieldContainer}>
            {/* <Text style={[styles.fieldLabel, {marginBottom: 15}]}>Receipt Date</Text> */}
            <DatePicker
              style={{width: "100%", height: 55, borderColor: COLOR.GRAY, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 0}}
              date={formValue['receiptDate']}
              mode="date"
              placeholder="Date"
              //format="YYYY-MM-DD"
              //minDate="1999-05-01"
              maxDate="2020-12-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateInput: {
                  //height: 55,
                  borderColor: COLOR.WHITE,
                  alignItems: 'flex-start',
                  //padding: 10,
                  //borderRadius: 5,
                  ...globalStyles.fieldInputStyle
                }
                // ... You can check the source to find the other keys.
              }}
              confirmBtnText={"Done"}
              showIcon={false}
              onDateChange={(date) => {handleUpdateFormValue('receiptDate',date)}}
            />
          </View>
          <View style={styles.fieldContainer}>
            {/* <Text style={styles.fieldLabel}>Category</Text> */}
          {
            formValue['receiptCategory'] && categoryOptions.length > 0 ? (

              <RNPickerSelect
                value={formValue['receiptCategory']}
                onValueChange={value => {handleUpdateFormValue('receiptCategory', value)}}
                items={categoryOptions}
                //itemKey={"value"}
                placeholder={{
                  label: "Category",
                  value: null,
                  key: ""
                }}
                style={pickerFieldStyle}
              />
              
            ) : (
              <RNPickerSelect
                onValueChange={value => {handleUpdateFormValue('receiptCategory', value)}}
                items={categoryOptions}
                //itemKey={"value"}
                placeholder={{
                  label: "Category",
                  value: null,
                  key: ""
                }}
                style={pickerFieldStyle}
              />
            )
          }
          </View>
          {/* <RNPickerSelect
            value={formValue['receiptCategory']}
            onValueChange={value => {handleUpdateFormValue('receiptCategory', value)}}
            items={categoryOptions}
            //itemKey={"value"}
            placeholder={{
              label: "Category",
              value: "",
              key: ""
            }}
            style={pickerFieldStyle}
          /> */}
          <View style={styles.fieldContainer}>
            {/* <Text style={styles.fieldLabel}>Total</Text> */}
            <TextInput
              mode="outlined"
              label="Total"
              placeholder="Total"
              value={formValue['total'] != undefined ? formValue['total'].toString() : ""}
              onChangeText={text => handleUpdateFormValue('total', text)}
              style={styles.fieldStyle}
              keyboardType={"decimal-pad"}
            />
          </View>
          <View style={styles.fieldContainer}>
            {/* <Text style={styles.fieldLabel}>Currency</Text> */}
          {
            formValue['receiptCurrency'] && currencyOptions.length > 0 ? (
              <RNPickerSelect
                value={formValue['receiptCurrency']}
                onValueChange={value => {handleUpdateFormValue('receiptCurrency', value)}}
                items={currencyOptions}
                placeholder={{
                  label: "Currency",
                  value: "",
                  key: ""
                }}
                style={pickerFieldStyle}
              />
            ) : (
              <RNPickerSelect
                onValueChange={value => {handleUpdateFormValue('receiptCurrency', value)}}
                items={currencyOptions}
                placeholder={{
                  label: "Currency",
                  value: "",
                  key: ""
                }}
                style={pickerFieldStyle}
              />
            )
          }
          </View>
          {/* <RNPickerSelect
            value={formValue['receiptCurrency']}
            onValueChange={value => {handleUpdateFormValue('receiptCurrency', value)}}
            items={currencyOptions}
            placeholder={{
              label: "Currency",
              value: "",
              key: ""
            }}
            style={pickerFieldStyle}
          /> */}
          <View style={styles.fieldContainer}>
            {/* <Text style={styles.fieldLabel}>Description</Text> */}
            <TextInput
              mode="outlined"
              label="Description"
              placeholder="Description (Optional)"
              value={formValue['description']}
              onChangeText={text => handleUpdateFormValue('description', text)}
              style={styles.fieldStyle}
              //multiline={true}
              //numberOfLines={3}
            />
          </View>
        </View>

      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleOnSubmit} style={[styles.submitButton]}>Save</Button>
        <Button mode="contained" onPress={handleChangeStateReceipt} style={[styles.submitButton]}>{currentStatus == "COMPLETED" ? "Move to Draft" : "Move to Complete"}</Button>
      </View>
      <LoadingComponent show={updatingReceipt || deletingReceipt} />
    </SafeAreaView>

  )
}

export default EditScreen;

const imageHeight = 300;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // padding: 20
  },


  imageContainer: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    position: 'relative',
    height: imageHeight,
    zIndex: 1,

    alignItems: 'center',
    justifyContent: 'center'
  },
  zoomButton: {
    position: 'absolute',
    backgroundColor: COLOR.WHITE,
    bottom: 10,
    right: 10,
    height: 35,
    width: 35,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContainer: {
    flex: 1,
    zIndex: 2,

  },
  formContainer: {
    // marginTop: imageHeight - 50,
    backgroundColor: COLOR.WHITE,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  fieldContainer: {
    marginBottom: 10
  },
  fieldLabel: {
    marginBottom: 5
  },
  fieldStyle: {

    // backgroundColor: COLOR.WHITE,
    // height: 55,
    // borderColor: COLOR.GRAY,
    // borderWidth: 1,
    // padding: 10,
    // borderRadius: 5,

    ...globalStyles.fieldInputStyle
  },


  buttonContainer: {
    paddingVertical: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  submitButton: {
    // marginTop: 10
  },
  texts: {
    textAlign: 'center'
  },
  submitButton: {
  },
  deleteButtonStyle: {
    marginRight: 15
  },
  supplierField: {
    borderColor: "transparent",
    shadowOpacity: 0,
    elevation: 0

  },



})