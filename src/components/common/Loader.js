import React from 'react';
import { Box, Spinner } from 'native-base';
import Colors from '../../constants/Colors';

export const Loader = ({ size = 'large' }) => (
  <Box flex={1} alignItems={'center'} justifyContent={'center'}>
    <Spinner size={size} color={Colors.primary} />
  </Box>
);
