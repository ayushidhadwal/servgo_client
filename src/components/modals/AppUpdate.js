import React, {useState} from 'react';
import {Button, Center, Image, Modal, Text} from 'native-base';

export const AppUpdate = () => {
  const [open, setOpen] = useState(true);

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)} safeAreaTop={true}>
      <Center zIndex={99}>
        <Image
          source={require('../../assets/rocket.png')}
          size={'md'}
          resizeMode={'contain'}
          alt={'text'}
          position={'absolute'}
          top={-25}
          shadow={5}
        />
      </Center>
      <Modal.Content maxWidth="350">
        <Modal.Body>
          <Text
            fontWeight="bold"
            fontSize={'xl'}
            color={'black'}
            textAlign={'center'}
            mt={10}>
            We are better than Ever
          </Text>
          <Text
            fontWeight="bold"
            fontSize={'sm'}
            color={'#6c6c6c'}
            textAlign={'center'}
            my={4}>
            The current version of the application is no longer supported.
            Please update the app.
          </Text>
          <Button
            onPress={() => setOpen(false)}
            size="md"
            variants={'solid'}
            bg={'primary.400'}
            _pressed={{
              _text: {color: 'muted.100'},
              bg: 'primary.400:alpha.80',
            }}>
            Update New Version
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
