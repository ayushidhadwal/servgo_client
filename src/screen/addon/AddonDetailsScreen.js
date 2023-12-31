import React, {useState} from 'react';
import {
  ScrollView,
  Box,
  Text,
  HStack,
  Divider,
  Button,
  Icon,
  IconButton,
} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {ImageSlider} from '../../components/common/ImageSlider';
import {useGetProductDetail} from '../../hooks/product/useGetProductDetail';
import {Loader} from '../../components/common/Loader';
import {URL} from '../../constants/base_url';
import {useError} from '../../hooks/useError';
import * as productActions from '../../store/actions/product';
import {successMessage} from '../../utils/message';

const DEFAULT_QTY = 1;

const AddonDetailsScreen = ({navigation, route}) => {
  const {productId} = route.params;

  const [productDetails, isLoading] = useGetProductDetail(productId);

  const dispatch = useDispatch();
  const setError = useError();

  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(DEFAULT_QTY);

  const onPressHandler = async () => {
    setError(null);
    setLoading(true);
    try {
      await dispatch(
        productActions.addToCart(
          productId,
          productDetails.branchId,
          productDetails.vendorId,
          productDetails.sellingPrice,
          qty,
        ),
      );
      successMessage('Added to cart Successfully');
      setQty(DEFAULT_QTY);
      navigation.navigate('CartScreen');
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView
      style={{flex: 1}}
      backgroundColor={'white'}
      edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <ImageSlider
          data={[
            URL + productDetails.productImage1,
            URL + productDetails.productImage2,
            URL + productDetails.productImage3,
            URL + productDetails.productImage4,
          ]}
        />
        <Box mx={4}>
          <Text fontSize={'md'} fontWeight={'400'}>
            {productDetails.title}
          </Text>
          <Divider w={8} backgroundColor={'primary.800'} mb={3} />
          <HStack>
            <Text fontSize={'xs'} color={'grey'}>
              PRICE:
            </Text>
            <Text fontSize={'xs'} color={'yellow.500'}>
              {' '}
              {productDetails.currency} {productDetails.sellingPrice}
            </Text>
          </HStack>
          <HStack>
            <Text fontSize={'xs'} color={'grey'}>
              MRP:
            </Text>
            <Text
              fontSize={'xs'}
              color={'yellow.500'}
              textDecorationLine={'line-through'}>
              {' '}
              {productDetails.currency} {productDetails.MRP}
            </Text>
          </HStack>
          <HStack>
            <Text fontSize={'xs'} color={'grey'}>
              DISCOUNT PRICE:
            </Text>
            <Text fontSize={'xs'} color={'yellow.500'}>
              {' '}
              {productDetails.currency} {productDetails.discount}
            </Text>
          </HStack>
          <Text> </Text>

          <Text color={'grey'} mb={3}>
            {productDetails.description}{' '}
          </Text>
          <Text>PRICE:</Text>
          <Divider w={8} backgroundColor={'primary.800'} mb={1} />
          <Text color={'yellow.500'}>
            {productDetails.currency} {productDetails.sellingPrice}
          </Text>
        </Box>
      </ScrollView>
      {productDetails.inCart ? (
        <Button
        my={5}
          backgroundColor={'primary.500'}
          size="lg"
          _text={{fontSize:18}}
          w={'95%'}
          alignSelf={'center'}
          isDisabled={loading}
          isLoading={loading}
          onPress={() => navigation.navigate('CartScreen')}
          startIcon={
            <Icon as={Ionicons} name="cart" size={7} color={'white'} />
          }>
          Go To Cart
        </Button>
      ) : (
        <HStack space={4} m={4}>
          <HStack>
            <IconButton
              borderRightRadius={0}
              px={4}
              size="xs"
              variant="solid"
              _icon={{
                as: MaterialIcons,
                name: 'remove',
                size: 'sm',
              }}
              onPress={() =>
                setQty(prevState => (prevState > 1 ? prevState - 1 : prevState))
              }
            />

            <Box
              borderWidth={0.5}
              px={5}
              alignItems="center"
              justifyContent="center">
              <Text fontWeight="bold">{qty}</Text>
            </Box>

            <IconButton
              borderLeftRadius={0}
              p={4}
              size="xs"
              variant="solid"
              _icon={{
                as: MaterialIcons,
                name: 'add',
                size: 'sm',
              }}
              onPress={() => setQty(prevState => prevState + 1)}
            />
          </HStack>
          <Button
            flex={1}
            backgroundColor={'primary.500'}
            size="lg"
            isDisabled={loading}
            isLoading={loading}
            onPress={onPressHandler}
            startIcon={
              <Icon as={Ionicons} name="cart" size={5} color={'white'} />
            }>
            Add to cart
          </Button>
        </HStack>
      )}
    </SafeAreaView>
  );
};

export default AddonDetailsScreen;
