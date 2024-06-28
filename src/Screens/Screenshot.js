import {
  Text,
  View,
  Pressable,
  StyleSheet,
  PixelRatio,
  TouchableOpacity,
  Button,
  Image,
  Platform,
} from 'react-native';
import {useState, useRef, useEffect, useCallback} from 'react';
import {
  makeImageFromView,
  Canvas,
  Image as SkiaImage,
} from '@shopify/react-native-skia';
import {WebView} from 'react-native-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import {captureScreen} from 'react-native-view-shot';

const pd = PixelRatio.get();
export default function Screenshot() {
  const viewRef = useRef(null);
  const webviewRef = useRef(null);
  const [image, setImage] = useState(null);
  const [hidden, sethidden] = useState(false);
  const [saveImage, setsaveImage] = useState(null);

  const deleteScreenshot = () => {
    if (Platform.OS === 'ios') {
      setImage(null);
    } else if (Platform.OS === 'android') {
      setsaveImage(null);
    }
  };
  const takeScreenshot = async () => {
    try {
      if (Platform.OS === 'ios') {
        const snapshot = await makeImageFromView(viewRef);
        console.log('snapshot', snapshot);
        setImage(snapshot);
      } else if (Platform.OS === 'android') {
        captureScreen({
          format: 'png',
          quality: 1,
        }).then(
          uri => {
            console.log('Image saved to', uri);
            setsaveImage(uri);
          },
          error => console.error('Oops, snapshot failed', error),
        );
      }
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    sethidden(false);
    const time = setTimeout(() => {
      sethidden(true);
    }, 6000);
    return () => {
      clearTimeout(time);
    };
  }, [image, saveImage]);

  const containerWidth = 100;
  const containerHeight = 200;

  const imageAspectRatio = image?.width() / image?.height();
  const containerAspectRatio = containerWidth / containerHeight;

  let imageWidth, imageHeight, offsetX, offsetY;

  if (imageAspectRatio > containerAspectRatio) {
    imageWidth = containerWidth;
    imageHeight = containerWidth / imageAspectRatio;
    offsetX = 0;
    offsetY = (containerHeight - imageHeight) / 2;
  } else {
    imageHeight = containerHeight;
    imageWidth = containerHeight * imageAspectRatio;
    offsetX = (containerWidth - imageWidth) / 2;
    offsetY = 0;
  }

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        onPress={takeScreenshot}
        style={{
          position: 'absolute',
          bottom: 120,
          right: 15,
          backgroundColor: '#fff',
          zIndex: 99999,
          padding: 10,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#000',
          elevation: 4,
        }}>
        <MaterialIcons name="screenshot" size={34} color={'#000'} />
      </TouchableOpacity>
      {(saveImage || image) && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 55,
            right: 15,
            zIndex: 9999,
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#000',
            elevation: 4,
          }}
          onPress={deleteScreenshot}>
          <MaterialIcons name="delete-forever" size={34} color={'#000'} />
        </TouchableOpacity>
      )}

      {image && (
        <Animatable.View
          delay={1000}
          animation={hidden === false ? 'zoomIn' : 'zoomOut'}
          style={{
            borderColor: 'red',
            borderWidth: 2,
            margin: 8,
            height: containerHeight,
            width: containerWidth,
            bottom: 55,
            left: 15,
            position: 'absolute',
            zIndex: 9999,
            borderRadius: 8,
            overflow: 'hidden',
          }}>
          <TouchableOpacity
            onPress={() => {
              console.log('pressed');
            }}
            style={{flex: 1}}>
            <Canvas style={StyleSheet.absoluteFill}>
              <SkiaImage
                image={image}
                x={offsetX}
                y={offsetY}
                width={imageWidth}
                height={imageHeight}
              />
            </Canvas>
          </TouchableOpacity>
        </Animatable.View>
      )}
      {saveImage && (
        <Animatable.View
          delay={1000}
          animation={hidden === false ? 'zoomIn' : 'zoomOut'}
          style={{
            borderColor: 'red',
            borderWidth: 2,
            margin: 8,
            bottom: 55,
            left: 15,
            position: 'absolute',
            zIndex: 9999,
            borderRadius: 8,
            overflow: 'hidden',
          }}>
          <TouchableOpacity>
            <Image
              source={{uri: saveImage}}
              style={{
                height: containerHeight,
                width: containerWidth,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </Animatable.View>
      )}
      <View ref={viewRef} collapsable={false} style={{flex: 1}}>
        <WebView
          ref={webviewRef}
          source={{
            // uri: 'https://www.google.com/',
            uri: 'https://m.youtube.com/',
          }}
          style={{flex: 1}}
          originWhitelist={['*']}
          javaScriptEnabled
          webviewDebuggingEnabled
          mediaPlaybackRequiresUserAction
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={false}
        />
      </View>
    </View>
  );
}
