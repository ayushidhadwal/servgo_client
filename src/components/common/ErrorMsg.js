import {Alert, CloseIcon, HStack, IconButton, Text, VStack} from 'native-base';
import React from 'react';
import {Platform} from 'react-native';

export const ErrorMsg = ({error, close}) => {
  return (
    <Alert
      alignSelf="center"
      flexDirection="row"
      status={'error'}
      position={'absolute'}
      bottom={Platform.OS === 'ios' ? 0 : -20}
      variant={'left-accent'}>
      <VStack space={1} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text
              fontSize="md"
              fontWeight="medium"
              flexShrink={1}
              color={'darkText'}>
              {error}
            </Text>
          </HStack>
          <IconButton
            variant="unstyled"
            icon={<CloseIcon size="3" />}
            _icon={{
              color: 'darkText',
            }}
            onPress={() => close()}
          />
        </HStack>
      </VStack>
    </Alert>
  );
};
