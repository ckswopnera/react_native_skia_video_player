import React from 'react';
import {useSharedValue} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native';
import {Canvas, useAnimatedImageValue, Image} from '@shopify/react-native-skia';

const SkiaEx = ({height, width}) => {
  const isPaused = useSharedValue(false);
  const bird = useAnimatedImageValue(
    // require('../Assets/bird.gif'),
    'https://media.giphy.com/media/sFcMnobHOZzoc/giphy.gif',
    // 'https://ipfs.io/ipfs/bafybeic75wkaqvblmte523qkzdoe437onrwl3xgvy5argmh6uhmrn7g2wi',
    isPaused,
  );
  return (
    <TouchableOpacity
      onPress={() => (isPaused.value = !isPaused.value)}
      style={{
        borderRadius: 10,
        // backgroundColor: 'red',
      }}>
      <Canvas
        style={{
          width: height,
          height: width,
        }}>
        <Image
          image={bird}
          x={0}
          y={0}
          width={height}
          height={width}
          fit="contain"
          opacity={1}
        />
      </Canvas>
    </TouchableOpacity>
  );
};
export default SkiaEx;
