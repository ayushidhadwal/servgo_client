import React from 'react';
import {Image, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch} from 'react-redux';
import appleAuth from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {errorMessage} from '../utils/message';
import {socialAuth} from '../store/actions/auth';

GoogleSignin.configure({
  webClientId:
    '803230793604-q0nf20o00i3epfhkl3i2opaccikembud.apps.googleusercontent.com',
  // offlineAccess: true,
  // forceCodeForRefreshToken: true,
  // iosClientId:
  //   '803230793604-uho8lv41g3gpvc7btc8706uecos3fr9a.apps.googleusercontent.com',
});

export const SocialLogin = () => {
  const dispatch = useDispatch();

  /* Apple Authenticate */
  const onAppleButtonPress = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    return auth().signInWithCredential(appleCredential);
  };

  /* Google Authenticate */
  const onGoogleButtonPress = async () => {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    return auth().signInWithCredential(googleCredential);
  };

  const serverAuthenticate = async ({type, uid, name, email}) => {
    try {
      await dispatch(socialAuth(type, uid, name, email));
    } catch (e) {
      errorMessage(e.message);
    }
  };

  return (
    <View>
      <View style={styles.divider}>
        <View style={styles.lines} />
        <Text> Or Continue With </Text>
        <View style={styles.lines} />
      </View>
      <View style={styles.rowStyles}>
        <Pressable
          style={styles.btnRow}
          onPress={() =>
            onGoogleButtonPress()
              .then(result => {
                serverAuthenticate({
                  type: 'GOOGLE',
                  name: result.user.displayName,
                  uid: result.user.uid,
                  email: result.user.email,
                });
              })
              .catch(e => errorMessage(e.message))
          }>
          <Image
            source={require('../assets/google.png')}
            style={styles.imgStyles}
          />
        </Pressable>

        {/*<Pressable style={styles.btnRow}>*/}
        {/*  <Image*/}
        {/*    source={require('../assets/facebook.png')}*/}
        {/*    style={styles.imgStyles}*/}
        {/*  />*/}
        {/*</Pressable>*/}

        {Platform.OS === 'ios' && (
          <Pressable
            style={styles.btnRow}
            onPress={() =>
              onAppleButtonPress()
                .then(result => {
                  serverAuthenticate({
                    type: 'APPLE',
                    name: result.user.displayName,
                    uid: result.user.uid,
                    email: result.user.email,
                  });
                })
                .catch(e => errorMessage(e.message))
            }>
            <Image
              source={require('../assets/apple.png')}
              style={styles.imgStyles}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnRow: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 6,
    borderRadius: 3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: RFValue(30),
  },
  lines: {
    backgroundColor: 'grey',
    height: 1,
    width: '30%',
  },
  rowStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  imgStyles: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
