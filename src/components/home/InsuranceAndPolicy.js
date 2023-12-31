import React from 'react';
import { Box, Button, Image, Text } from 'native-base';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';

export const InsuranceAndPolicy = () => {
  const { t } = useTranslation('langChange');

  return (
    <>
      {/*/!* Insurance protection program start~ *!/*/}
      <Box
        px={5}
        py={2}
        bg={'#ededed'}
        mb={2}
        flexDirection={'row'}
        justifyContent={'space-between'}>
        <Image
          source={require('../../assets/shield.png')}
          alt={'img'}
          w={20}
          h={20}
          mt={2}
        />
        <Box flex={1} pl={15}>
          <Text fontWeight={'bold'} fontSize={'md'} pb={2}>
            {t('servGoInsu')}
          </Text>
          <Text fontSize={'sm'}>{t('servGoInsuMsg')}</Text>
          <Text
            fontWeight={'bold'}
            color={Colors.primary}
            py={2}
            fontSize={'sm'}
            onPress={() => Linking.openURL('https://serv-go.com/')}>
            {t('learnMore')}
          </Text>
        </Box>
      </Box>
      {/*/!* Insurance protection program end~ *!/*/}

      {/*/!* Anti discrimination policy start~ *!/*/}
      <Box
        px={5}
        py={2}
        bg={'#ededed'}
        mb={2}
        flexDirection={'row'}
        justifyContent={'space-between'}>
        <Box flex={1} pr={15}>
          <Text fontWeight={'bold'} fontSize={'md'}>
            {t('antiDisc')}
          </Text>
          <Text fontSize={'sm'}>{t('antiDiscMsg')}</Text>
          <Button
            variant="solid"
            width={'60%'}
            alignSelf={'flex-start'}
            my={2}
            onPress={() => Linking.openURL('https://serv-go.com/')}>
            {t('knowMoreBtn')}
          </Button>
        </Box>
        <Image
          source={require('../../assets/heart.png')}
          alt={'img'}
          width={70}
          height={70}
          mt={2}
        />
      </Box>
      {/*/!* Anti discrimination policy ends~ *!/*/}
    </>
  );
};
