import * as React from 'react';
import {Dimensions, Modal, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import {Box, IconButton} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useMemo} from 'react';

const DEFAULT_ZOOM = 1;
const MAX_ZOOM = 2;

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

export const ZoomImage = ({modalVisible, onClose, image}) => {
  // const [imgHeight, setImgHeight] = useState(HEIGHT);

  const {top} = useSafeAreaInsets();
  const scale = useSharedValue(DEFAULT_ZOOM);
  const translateX = useSharedValue(0);
  const savedX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedY = useSharedValue(0);

  // Image.getSize(picture, (width, height) => {
  //   setImgHeight(height);
  // });

  const derivedTranslateX = useDerivedValue(() => {
    const offsetFactor = (1.0 - scale.value) / 2;
    const dy = (WIDTH * offsetFactor) / scale.value;
    const offset = dy * -1;

    const left = offset;
    const right = -offset;

    return Math.max(Math.min(translateX.value, left), right);
  });

  const derivedTranslateY = useDerivedValue(() => {
    const offsetFactor = (1.0 - scale.value) / 2;
    const dy = (180 * offsetFactor) / scale.value;
    const offset = dy * -1;

    const top = offset;
    const bottom = -offset;

    return Math.max(Math.min(translateY.value, top), bottom);
  });

  const tapGesture = useMemo(() => {
    return Gesture.Tap()
      .numberOfTaps(2)
      .onStart(() => {
        scale.value = withTiming(
          scale.value === DEFAULT_ZOOM ? MAX_ZOOM : DEFAULT_ZOOM,
        );
      });
  }, [scale]);

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onStart(() => {
        savedX.value = translateX.value;
        savedY.value = translateY.value;
      })
      .onUpdate(event => {
        translateX.value = event.translationX + savedX.value;
        translateY.value = event.translationY + savedY.value;
      })
      .onEnd(event => {
        translateX.value = withDecay({velocity: event.velocityX});
        translateY.value = withDecay({velocity: event.velocityY});
      });
  }, [savedX, savedY, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: scale.value},
        {translateX: derivedTranslateX.value},
        {translateY: derivedTranslateY.value},
      ],
    };
  });

  const composedGesture = Gesture.Simultaneous(tapGesture, panGesture);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}>
      <Box flex={1} bg={'black'}>
        <IconButton
          zIndex={1}
          alignSelf={'flex-start'}
          mx={4}
          style={{marginTop: top}}
          colorScheme="black"
          variant={'solid'}
          borderRadius={'full'}
          _icon={{
            as: MaterialIcons,
            name: 'arrow-back-ios',
            color: 'white',
            size: 'lg',
          }}
          size={'md'}
          onPress={onClose}
        />
        <GestureDetector gesture={composedGesture}>
          <Animated.Image
            key={image}
            source={image}
            alt={'img'}
            resizeMode={'contain'}
            style={[StyleSheet.absoluteFillObject, animatedStyle]}
          />
        </GestureDetector>
      </Box>
    </Modal>
  );
};
