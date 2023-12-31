import React from 'react';
import {Box, Image, Text} from 'native-base';
import dayjs from 'dayjs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import Swiper from 'react-native-swiper';
import {useTranslation} from 'react-i18next';

import Colors from '../../constants/Colors';

export const HomeTestimonials = () => {
  const {testimonial} = useSelector(state => state.home);
  const {t} = useTranslation('langChange');

  return (
    <>
      {testimonial.length > 0 && (
        <Box px={5} py={2} bg={'#ededed'} mb={2}>
          <Text fontSize={'lg'} fontWeight={'bold'}>
            {t('custSafety')}
          </Text>
          <Text fontSize={'sm'}>{t('whatCustSay')}</Text>
          <Swiper height={220}>
            {testimonial.map((item, index) => (
              <Box
                borderWidth={1}
                bg={Colors.white}
                p={2}
                my={2}
                borderRadius={10}
                borderColor={'#d9edfa'}
                key={index.toString()}>
                <Box flexDirection={'row'}>
                  <Image
                    source={{uri: URL + item.photo}}
                    alt={'img'}
                    width={12}
                    height={12}
                    resizeMode={'contain'}
                    borderRadius={'full'}
                  />
                  <Box alignItems={'center'} pl={2}>
                    <Text
                      fontSize={'lg'}
                      fontWeight={'bold'}
                      color={Colors.primary}>
                      {item.name}
                    </Text>
                    <Text color={Colors.primary}>
                      {dayjs(item.created_at).format('DD MMM YYYY , hh:mm a')}
                    </Text>
                  </Box>
                </Box>
                <Box flexDirection={'row'} py={2}>
                  <Ionicons
                    name="md-star"
                    size={20}
                    color={item.rating !== 0 ? Colors.darkYellow : 'grey'}
                  />
                  <Ionicons
                    name="md-star"
                    size={20}
                    color={item.rating >= 2 ? Colors.darkYellow : 'grey'}
                  />
                  <Ionicons
                    name="md-star"
                    size={20}
                    color={item.rating >= 3 ? Colors.darkYellow : 'grey'}
                  />
                  <Ionicons
                    name="md-star"
                    size={20}
                    color={item.rating >= 4 ? Colors.darkYellow : 'grey'}
                  />
                  <Ionicons
                    name="md-star"
                    size={20}
                    color={item.rating >= 5 ? Colors.darkYellow : 'grey'}
                  />
                </Box>
                <Text color={Colors.primary} numberOfLines={3}>
                  {item.comment}
                </Text>
              </Box>
            ))}
          </Swiper>
        </Box>
      )}
    </>
  );
};
