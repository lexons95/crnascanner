import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingComponent = (props) => {
  const { show=true } = props;
  if (show) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loading} color={"#fff"}/>
      </View>
    )
  }
  return null;
}

export default LoadingComponent;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 5
  },
  loading: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 75,
    height: 75,
    borderRadius: 10
  }
})