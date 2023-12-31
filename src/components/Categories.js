import React from 'react';
import {useSelector} from 'react-redux';
import {Text, Pressable, FlatList} from 'native-base';

import {IMG_URL} from '../constants/base_url';
import {SearchHeader} from './home/SearchHeader';
import {HomeSlider} from './home/HomeSlider';
import {InsuranceAndPolicy} from './home/InsuranceAndPolicy';
import {ReferToWin} from './home/ReferToWin';
import {HomeTestimonials} from './home/HomeTestimonials';
import {ProductMenu} from './home/ProductMenu';
import {Image} from './Image';

const Categories = ({onCategoryPress, navigation}) => {
  const {services} = useSelector(state => state.home);
  const {lang} = useSelector(state => state.lang);

  return (
    <FlatList
      extraData={services}
      data={services}
      keyExtractor={item => String(item.id)}
      numColumns={4}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={{paddingHorizontal: 10}}
      ListHeaderComponent={() => {
        return (
          <SearchHeader
            onLocationPress={() => navigation.navigate('AddressBook')}
          />
        );
      }}
      ListFooterComponent={() => {
        return (
          <>
            <ProductMenu />
            <HomeSlider />

            <HomeTestimonials />
            <ReferToWin navigation={navigation} />
            <InsuranceAndPolicy />
          </>
        );
      }}
      renderItem={({item, index}) => {
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
              onCategoryPress(
                item.id,
                item.en_service_name,
                item.ar_service_name,
                index,
              );
            }}>
            <Image
              source={{
                uri: IMG_URL + item.service_icon,
              }}
              style={{width: 35, height: 35}}
              resizeMode="stretch"
            />
            <Text
              numberOfLines={2}
              textAlign={'center'}
              paddingTop={2}
              fontSize={12}>
              {lang === 'en' ? item.en_service_name : item.ar_service_name}
            </Text>
          </Pressable>
        );
      }}
    />
  );
};

export default Categories;
