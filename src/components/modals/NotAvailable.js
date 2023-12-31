import React from 'react';
import {Center, Image, Modal, Text} from 'native-base';

export const NotAvailable = ({isNoAvailable}) => {
  return (
    <Modal
      onClose={() => {}}
      isOpen={isNoAvailable}
      safeAreaTop={true}
      bg="muted.900:alpha.80"
      closeOnOverlayClick={false}>
      <Modal.Content maxWidth="350">
        <Modal.Body>
          <Center>
            <Image
              source={require('../../assets/2.png')}
              size="2xl"
              resizeMode="cover"
              alt="text"
              shadow={4}
            />
          </Center>
          <Text
            fontWeight="bold"
            fontSize="xl"
            color="black"
            textAlign="center"
            mt={2}>
            OOPS!
          </Text>
          <Text fontSize="sm" color="#6c6c6c" textAlign="center" my={4}>
            Looks like our services are not available in your country.
          </Text>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
