import React from 'react';
import {FlatList, Pressable, Text} from 'native-base';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../constants/Colors';
import {CATEGORY_IMAGE} from '../../constants/base_url';
import {Image} from '../Image';

export const ProductMenu = () => {
  const {t} = useTranslation('langChange');

  const {lang} = useSelector(state => state.lang);
  const {CategoryList: categories} = useSelector(state => state.product);
  const navigation = useNavigation();

  return (
    <FlatList
      data={categories}
      keyExtractor={item => String(item.id)}
      numColumns={4}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={{paddingHorizontal: 10}}
      ListHeaderComponent={() => {
        return (
          <Text
            textAlign={'left'}
            color={Colors.primary}
            fontWeight={'bold'}
            fontSize={'lg'}
            ml={15}
            mb={2}
            mt={3}>
            {t('buyProducts')}
          </Text>
        );
      }}
      renderItem={({item}) => {
        return (
          <Pressable
            justifyContent={'space-between'}
            alignItems={'center'}
            flex={1 / 4}
            m={1.5}
            backgroundColor={'white'}
            shadow={2}
            padding={2}
            borderRadius={5}
            onPress={() => {
              navigation.navigate('Addon', {
                productCategoryId: item.id,
              });
            }}>
            <Image
              source={{uri: CATEGORY_IMAGE + item.category_icon}}
              style={{width: 35, height: 35}}
              resizeMode="stretch"
            />
            <Text
              numberOfLines={2}
              textAlign={'center'}
              paddingTop={2}
              fontSize={12}>
              {lang === 'en' ? item.en_category_name : item.ar_category_name}
            </Text>
          </Pressable>
        );
      }}
    />
  );
};
