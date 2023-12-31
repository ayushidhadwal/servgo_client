import React, {useCallback, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {
  Box,
  FormControl,
  Input,
  Modal,
  WarningOutlineIcon,
  Text,
  Pressable,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import {Loader} from './Loader';

export const SearchableDropdown = ({
  label,
  dataSource,
  selectedId,
  selectedName,
  updateVal,
  error,
  icon,
  placeholder,
  isDisabled,
  isLoading,
}) => {
  const [show, setShow] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setFilteredList([...dataSource]);
  }, [dataSource]);

  const onPressHandler = (id, name) => {
    setShow(false);
    updateVal(id, name);
  };

  const _onSearchHandler = useCallback(
    text => {
      setSearch(text);
      if (text !== '') {
        const filterData = filteredList.filter(m =>
          m.name.toLowerCase().includes(text.toLowerCase()),
        );
        setFilteredList([...filterData]);
      } else {
        setFilteredList([...dataSource]);
      }
    },
    [dataSource, filteredList],
  );

  return (
    <>
      <FormControl w={'95%'} alignSelf={'center'} isInvalid={false} mb={2}>
        <FormControl.Label>{label}</FormControl.Label>
        {isLoading ? (
          <Loader size="small" />
        ) : (
          <Pressable onPress={() => !isDisabled && setShow(true)}>
            <Box pointerEvents={'none'}>
              <Input
                isDisabled={isDisabled}
                placeholder={placeholder}
                variant="underlined"
                size={'lg'}
                colorScheme={'#226ea0'}
                value={selectedName}
                showSoftInputOnFocus={false}
                InputLeftElement={
                  icon ? (
                    <Ionicons
                      name={icon}
                      size={24}
                      color={Colors.primary}
                      style={{marginRight: 8}}
                    />
                  ) : null
                }
                InputRightElement={
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color={Colors.black}
                  />
                }
                editable={false}
              />
            </Box>
          </Pressable>
        )}

        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {error}
        </FormControl.ErrorMessage>
      </FormControl>
      <Box>
        <Modal
          isOpen={show}
          onClose={() => setShow(false)}
          avoidKeyboard
          size="lg">
          <Modal.Content bg={'white'}>
            <Modal.CloseButton />
            <Modal.Header>Choose</Modal.Header>
            <Modal.Body bg={'white'}>
              <Input
                variant="underlined"
                size={'lg'}
                mb={3}
                value={search}
                onChangeText={_onSearchHandler}
                placeholder={placeholder}
              />
              {filteredList.length > 0 ? (
                <FlatList
                  data={filteredList}
                  keyExtractor={item => item.id}
                  renderItem={({item, index}) => {
                    return (
                      <Pressable
                        key={index}
                        onPress={() => onPressHandler(item.id, item.name)}
                        backgroundColor={
                          selectedId === item.id
                            ? 'primary.400:alpha.90'
                            : 'white'
                        }
                        p={2}
                        alignContent={'center'}
                        mb={1}>
                        <Text
                          fontSize={'md'}
                          color={selectedId === item.id ? 'muted.50' : 'black'}
                          textAlign={'left'}>
                          {item.name}
                        </Text>
                      </Pressable>
                    );
                  }}
                />
              ) : (
                <Text
                  fontSize={'md'}
                  color={'primary.400'}
                  textAlign={'center'}>
                  No Data Found
                </Text>
              )}
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Box>
    </>
  );
};
