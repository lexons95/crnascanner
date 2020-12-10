import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { Button, StyleSheet, TouchableOpacity, View, Dimensions, RefreshControl } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useReceiptsQuery, useListsQuery } from '../utils/ApolloAPI';

import TabPendingScreen from './TabPendingScreen';
import TabCompletedScreen from './TabCompletedScreen';
import TabClosedScreen from './TabClosedScreen';

import { COLOR } from '../constants/globalStyles';
import LoadingComponent from '../component/LoadingComponent';
Icon.loadFont();

const initialLayout = { width: Dimensions.get('window').width };

const DataTabsScreen = ({ route, navigation }) => {
  const [ data, setData ] = useState(null);

  const [index, setIndex] = React.useState(1);
  const [routes] = React.useState([
    { key: 'pending', title: 'Pending' },
    { key: 'completed', title: 'Completed' },
    { key: 'closed', title: 'Ready' }
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const tabsRef = useRef(null);

  
  useEffect(()=>{
    const currentData = route.params && route.params['data'] ? route.params['data'] : null;
    setData(currentData);
  },[]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: data ? data.name : "null",
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={.4}
          onPress={() =>
            navigation.navigate('CameraScreen')
          }
          style={styles.addReceiptButton}
        >
        <Icon name="add" size={20} style={styles.plusIcon}/>
      </TouchableOpacity>
      ),
    });
  }, [navigation, data]);

  const refreshControlFunc = () => {
    const onRefresh = useCallback(() => {
      if (refetch && tabsRef) {
        setRefreshing(true);
        refetch().then(result=>{
          setRefreshing(false);
        }).catch(err=>{
          console.log("refetch err", err)
          setRefreshing(false);
        })
      }
    }, []);
    return (<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />)
  }

  let refreshControl = refreshControlFunc()

  const { data: receiptsData, loading: loadingReceipts, refetch } = useReceiptsQuery({
    variables: {
      filter: {
        where: {
          tenant_id: data && data.code ? data.code : ""
        },
        order: [
          ["createdAt", "ASC"]
        ]
      }
    },
    skip: data == null,
    onCompleted: (result) => {
      if (result && result.receipts) {
        let allData = JSON.parse(JSON.stringify(result.receipts))
        // setDataSource(allData);
      }
    },
    error: (err) => {
      console.log("receipts err", err)
    }
  })

  let receipts = data == null ? [] : (receiptsData && receiptsData.receipts ? JSON.parse(JSON.stringify(receiptsData.receipts)) : [])

  let pendingReceipts = receipts.filter((aReceipt=>{
    return aReceipt.status == 'PENDING'
    //return true
  }));
  // let failedReceipts = receipts.filter((aReceipt=>{
  //   return aReceipt.status == 'FAILED'
  // }));
  let completedReceipts = receipts.filter((aReceipt=>{
    return aReceipt.status == 'COMPLETED'
    //return true
  }));
  let closedReceipts = receipts.filter((aReceipt=>{
    return aReceipt.status == 'C'
    //return true
  }));

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'pending':
        return <TabPendingScreen jumpTo={jumpTo} data={data} listData={pendingReceipts} refetchListData={refetch} refreshControl={refreshControl} />;
      case 'completed':
        return <TabCompletedScreen jumpTo={jumpTo} data={data} navigation={navigation} listData={completedReceipts} refetchListData={refetch} refreshControl={refreshControl} />;
      case 'closed': 
        return <TabClosedScreen jumpTo={jumpTo} data={data} navigation={navigation} listData={closedReceipts} refetchListData={refetch} refreshControl={refreshControl} />
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ 
        backgroundColor: COLOR.PRIMARY
      }}
      activeColor={COLOR.PRIMARY}
      inactiveColor={COLOR.GRAY}
      style={{ 
        backgroundColor: COLOR.WHITE,
      }}
    />
  );

  return (
    <View style={styles.container} ref={tabsRef}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
      <LoadingComponent show={loadingReceipts && !refreshing} />
      {/* <View>
        <Text>Suppliers List</Text>
      </View> */}
    </View>
  );
}

export default DataTabsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  plusIcon: {
    // marginRight: 15
  },
  addReceiptButton: {
    // borderWidth: 1,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 15
    // marginRight: 15
  }
});