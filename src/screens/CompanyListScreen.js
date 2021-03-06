import React, { useState, useEffect, useCallback, useContext} from 'react';
import { FlatList, RefreshControl, StyleSheet, SafeAreaView } from 'react-native';
import { List, Button } from 'react-native-paper';
import { AuthContext } from '../utils/AuthContext';
import { useAddTenantClientMutation, useTenantsQuery } from '../utils/ApolloAPI';

import Icon from 'react-native-vector-icons/FontAwesome';
import { COLOR, globalStyles } from '../constants/globalStyles';
import LoadingComponent from '../component/LoadingComponent';
Icon.loadFont();

const CompanyListScreen = ({ route, navigation }) => {
  const [ state, { setCompany } ] = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  let tenant = state && state.tenant ? state.tenant : null;

  let filter = {}
  if (tenant != null) {
    filter = {
      where: {
        parent_id: tenant.code
      }
    }
  }
  
  const { data: companyData, loading: loadingCompany, refetch } = useTenantsQuery({
    variables: {
      filter: filter
    },
    skip: tenant == null
  })

  let data = companyData && companyData.tenants ? companyData.tenants : []

  const onRefresh = () => {
    if (refetch) {
      setRefreshing(true);
      refetch().then(result=>{
        setRefreshing(false);
      }).catch(err=>{
        console.log("refetch err", err)
        setRefreshing(false);
      })
    }
  };

  const refreshControl = () => {
    // if (refetch) {
    //   return (<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />)
    // }
    // return null;
    return (<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />)

  }

  const handleOnPressItem = (data) => {
    setCompany(data)
    navigation.navigate("DataTabsScreen", { data: data })
  }

  const [ addTenantClient ] = useAddTenantClientMutation({
    onCompleted: (result) => {

    },
    onError: (err) => {
      console.log('addTenantClient err', err)
    }
  });

  const handleCreateTenant = () => {
    addTenantClient({
      variables: {
        tenant_id: "zxc",
        code: "clientBofzxc",
        name: "Client B zxc",
        email: "clientb.zxc@hotmail.com",
        contactPerson: "0166666666"
      }
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) => <ListItem data={item} onPress={handleOnPressItem}/>}
        keyExtractor={(item, index) => item + index}
        refreshControl={refreshControl()}
      />
      {/* <Button onPress={()=>{handleCreateTenant()}}>Add client</Button> */}
      <LoadingComponent show={loadingCompany && !refreshing}/>
    </SafeAreaView>
  );
}

const ListItem = (props) => {
  const { data={}, onPress } = props;
  let status = "default"; // default (white), red/orange (require to edit)

  let needEdit = false;
  let itemStyle = {};
  if (needEdit) {
    itemStyle = {
      ...styles.statusWarning
    }
  }

  const handleOnPress = () => {
    if (onPress) {
      onPress(data)
    }
  }

  return (
    <List.Item
      title={data && data.name ? data.name : ""}
      //description={data.code}
      onPress={handleOnPress}
      style={styles.listItem}
      //left={props => <List.Icon {...props} icon="folder" />}
    />
  )
}

export default CompanyListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    //marginHorizontal: 16
  },
  listItem: {
    marginTop: 10,
    height: 55,
    backgroundColor: COLOR.WHITE,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.7,
    shadowRadius: 1,
    elevation: 4
  },
  statusWarning: {
    backgroundColor: "#FFD081"
  }
})