import * as React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Box, Icon, IconButton, Image} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../../constants/Colors';
import { useGetCartList } from '../../hooks/cart/useGetCartList';
import {View,Text} from 'native-base'

export const HomeHeader = props => {
  const [ProductCartList, ServiceCartList, loading] = useGetCartList();

  const cartLength = ProductCartList.length + ServiceCartList.length;
  return (
    <SafeAreaView edges={['top']} style={{backgroundColor: Colors.primary}}>
      <Box
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        marginHorizontal={5}>
        <Box
          width={'40%'}
          height={50}
          marginBottom={2}
          backgroundColor={Colors.primary}>
          <Image
            source={require('../../assets/Color_logo_no_background.png')}
            alt={'img'}
            width={'100%'}
            height={'100%'}
            resizeMode={'contain'}
          />
        </Box>
        <Box flexDirection={'row'} alignItems={'center'}>
          <IconButton
            icon={<Icon as={Ionicons} name="search" />}
            borderRadius="full"
            onPress={() => props.navigation.navigate('AllService')}
            _icon={{
              color: 'white',
              size: 'lg',
            }}
            colorScheme={'muted'}
          />
             <View style={{  }}>
            <Entypo onPress={() => {  props.navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={23} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
          {/* <IconButton
            icon={<Icon as={Ionicons} name="cart" />}
            borderRadius="full"
            onPress={() => props.navigation.navigate('CartScreen')}
            _icon={{
              color: 'white',
              size: 'lg',
            }}
            colorScheme={'muted'}
          /> */}

          <IconButton
            icon={<Icon as={Ionicons} name="person" />}
            borderRadius="full"
            onPress={() => props.navigation.navigate('Profile')}
            _icon={{
              color: 'white',
              size: 'lg',
            }}
            colorScheme={'muted'}
          />
        </Box>
      </Box>
    </SafeAreaView>
  );
};
