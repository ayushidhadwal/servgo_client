import {Box, Image, Pressable, Text} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Platform} from 'react-native';
import {useTranslation} from 'react-i18next';

export const ReferToWin = ({navigation}) => {
  const {t} = useTranslation('langChange');

  return (
    <Pressable
      px={5}
      py={2}
      bg={'#ededed'}
      my={2}
      flexDirection={'row'}
      justifyContent={'space-between'}
      onPress={() => navigation.navigate('Reward')}>
      <Image
        source={require('../../assets/gift.png')}
        alt={'img'}
        width={35}
        height={35}
      />
      <Box>
        <Text fontWeight={'bold'} fontSize={'md'}>
          {t('refer')}
        </Text>
        <Text fontSize={'sm'}>{t('referMsg')}</Text>
      </Box>
      <Ionicons
        name={Platform.OS === 'ios' ? 'ios-caret-forward' : 'md-caret-forward'}
        size={24}
        color="black"
        style={{alignSelf: 'flex-end', paddingBottom: 8}}
      />
    </Pressable>
  );
};
