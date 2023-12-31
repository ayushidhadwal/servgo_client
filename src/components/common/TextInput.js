import React from 'react';
import {FormControl, Input, WarningOutlineIcon, Icon} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const TextInput = ({
  onChangeText,
  onBlur,
  value,
  icon,
  error,
  label,
  isInvalid,
  _FormControlProps = {},
  _InputProps = {},
}) => {
  return (
    <FormControl {..._FormControlProps} mb={2} isInvalid={isInvalid}>
      <FormControl.Label>{label}</FormControl.Label>
      <Input
        {..._InputProps}
        variant="underlined"
        size={'lg'}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        InputLeftElement={
          <Icon
            as={Ionicons}
            name={icon}
            color="primary.400"
            size={'md'}
            mr={2}
          />
        }
      />
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {error}
      </FormControl.ErrorMessage>
    </FormControl>
  );
};
