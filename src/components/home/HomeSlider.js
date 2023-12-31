import React from 'react';
import Swiper from 'react-native-swiper';
import {RFValue} from 'react-native-responsive-fontsize';
import {Box, Image} from 'native-base';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const IMAGE_SLIDER = [
  'https://image.freepik.com/free-photo/female-hairdresser-using-hairbrush-hair-dryer_329181-1929.jpg',
  'https://img.freepik.com/free-photo/man-disinfects-his-apartment-protective-suit-protection-against-covid-19-disease-prevention-spread-pneumonia-virus-surface-concept-chemical-disinfection-against-viruses_359992-40.jpg?size=626&ext=jpg',
  'https://img.freepik.com/free-photo/professional-overalls-with-tools-background-repair-site-home-renovation-concept_169016-7323.jpg?size=626&ext=jpg',
  'https://img.freepik.com/free-photo/technician-service-removing-air-filter-air-conditioner-cleaning_35076-3618.jpg?size=626&ext=jpg',
];

const HOME_BANNER = require('../../assets/Homebanner.jpg');

export const HomeSlider = () => {
  return (
    <>
      {/*/!* Image Slider Start~ *!/*/}
      <Box px={5} mt={3} bg={'#fff'}>
        <Swiper height={RFValue(200)} autoplay activeDotColor="#000">
          {IMAGE_SLIDER.map((slide, i) => (
            <Box width={wp('100%')} height={hp('22%')} key={i.toString()}>
              <Image
                source={{
                  uri: slide,
                }}
                alt={'img'}
                width={'100%'}
                height={'100%'}
                resizeMode={'cover'}
              />
            </Box>
          ))}
        </Swiper>
      </Box>
      {/*/!* Image Slider Ends~ *!/*/}

      {/*/!* Home Banner Start~ *!/*/}
      <Box width={wp('100%')} height={hp('15%')} mb={2}>
        <Image
          source={HOME_BANNER}
          width={'100%'}
          height={'100%'}
          resizeMode={'cover'}
          alt={'img'}
        />
      </Box>
      {/*/!* Home Banner Ends~ *!/*/}
    </>
  );
};
