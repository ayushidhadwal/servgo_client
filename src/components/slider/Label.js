import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const Label = ({ text, ...restProps }) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    color: "#fff",
  },
});

export default memo(Label);