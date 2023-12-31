import Toast from 'react-native-toast-message';

export const successMessage = (title, message) => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
  });
};

export const errorMessage = message => {
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: message,
  });
};
