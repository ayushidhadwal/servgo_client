import React from 'react';
import { Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../constants/Colors';

export const TextRow = ({ heading, desc, style }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        marginHorizontal: RFValue(10),
        marginBottom: RFValue(5),
      }}>
      <Text style={{ fontWeight: 'bold', color: Colors.primary }}>
        {heading}:{' '}
      </Text>
      <Text
        numberOfLines={2}
        style={[
          { color: Colors.black, flexShrink: 1, textAlign: 'left' },
          style,
        ]}>
        {desc}
      </Text>
    </View>
  );
};
