import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Pressable, Box, Text, HStack, VStack} from 'native-base';
import {FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';

import * as productActions from '../../store/actions/product';
import {useError} from '../../hooks/useError';
import {Loader} from '../../components/common/Loader';
import {SUB_IMG_URL, URL} from '../../constants/base_url';
import {Image} from '../../components/Image';

const AddonScreen = ({navigation, route}) => {
  const {t} = useTranslation('langChange');

  const {productCategoryId} = route.params;

  const {lang} = useSelector(state => state.lang);
  const {ProductList, subCategoryList} = useSelector(state => state.product);

  const dispatch = useDispatch();
  const setError = useError();

  const flatListRef = useRef(null);

  const [subProductId, setSubProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);

  const onClickHandler = useCallback(
    async subId => {
      setProductLoading(true);
      setError(null);
      setSubProductId(subId);
      try {
        await dispatch(productActions.getProductList(productCategoryId, subId));
      } catch (e) {
        setError(e.message);
      } finally {
        setProductLoading(false);
      }
    },
    [dispatch, productCategoryId, setError],
  );

  const setProductSubCategory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(productActions.getSubCategoryList(productCategoryId));
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, productCategoryId, setError]);

  useEffect(() => {
    setProductSubCategory();
  }, [setProductSubCategory]);

  useEffect(() => {
    if (subCategoryList.length > 0 && !subProductId) {
      const [item] = subCategoryList;
      setSubProductId(item.id);
    }
  }, [subCategoryList, subProductId]);

  const renderItem = ({item, index}) => {
    return (
      <Pressable
        flex={1 / 2}
        onPress={() =>
          navigation.navigate('AddonDetails', {productId: item.id})
        }
        p={2}
        borderRadius={8}
        ml={index === 0 || index % 2 === 0 ? 3 : 0}
        mt={index === 0 || index === 1 ? 3 : 0}
        mb={3}
        mr={3}
        backgroundColor="white"
        shadow={1}>
        <Image
          source={{uri: URL + item.product_image1}}
          style={{height: 120, width: '100%'}}
          resizeMode="stretch"
        />
        <Text mb={2} fontWeight="bold" mt={1} numberOfLines={2}>
          {item.title}
        </Text>
        <HStack>
          <Text fontSize={'xs'} color={'grey'}>
            Price:{' '}
          </Text>
          <Text fontSize={'xs'} color={'yellow.500'}>
            <Text
              fontSize={'xs'}
              color={'grey'}
              textDecorationLine={'line-through'}>
              {item.currency} {item.MRP}
            </Text>{' '}
            {item.currency} {item.Selling_Price}
          </Text>
        </HStack>

        <HStack mb={1}>
          <Text fontSize={'xs'} color={'grey'}>
            Discount:
          </Text>
          <Text fontSize={'xs'} color={'yellow.500'}>
            {item.currency} {item.discount}
          </Text>
        </HStack>

        {item.inventory > 0 ? (
          <Text color={'green.700'} fontSize={'xs'} bold>
            IN STOCK
          </Text>
        ) : (
          <Text color={'red.700'} fontSize={'xs'} bold>
            OUT OF STOCK
          </Text>
        )}
      </Pressable>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (subCategoryList.length === 0) {
    return (
      <Box alignItems={'center'} justifyContent="center" flex={1} p={5}>
        <Text color={'gray.500'}> No Data !</Text>
      </Box>
    );
  }

  return (
    <VStack safeAreaBottom flex={1} backgroundColor={'white'}>
      <Box shadow={1} bg={'white'} pl={3}>
        <FlatList
          ref={flatListRef}
          data={subCategoryList}
          keyExtractor={item => String(item.id)}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          renderItem={({item}) => {
            return (
              <Pressable
                onPress={() => onClickHandler(item.id)}
                w={120}
                alignItems="center"
                mr={3}
                my={2}
                borderBottomColor="primary.300"
                borderBottomWidth={subProductId === item.id ? 4 : 0}>
                <Image
                  source={{
                    uri: SUB_IMG_URL + item.sub_category_icon,
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginBottom: 12,
                  }}
                  resizeMode={'contain'}
                />

                <Text numberOfLines={3} textAlign="center" fontWeight="bold">
                  {lang === 'en'
                    ? item.en_sub_category_name
                    : item.ar_sub_category_name}
                </Text>
              </Pressable>
            );
          }}
        />
      </Box>

      <Box flex={1}>
        {productLoading ? (
          <Loader />
        ) : ProductList.length > 0 ? (
          <FlatList
            data={ProductList}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
          />
        ) : (
          <Box alignItems={'center'} justifyContent="center" flex={1} p={5}>
            <Text color={'gray.500'}>No Data !</Text>
          </Box>
        )}
      </Box>
    </VStack>
  );
};

export default AddonScreen;
