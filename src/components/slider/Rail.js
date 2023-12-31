import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from "../../constants/Colors";

const Rail = () => {
  return (
    <View style={styles.root}/>
  );
};

export default memo(Rail);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#abd9f7',
  },
});