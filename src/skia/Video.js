import React, {useEffect, useRef, useState} from 'react';
import {
  Canvas,
  Fill,
  ImageShader,
  useVideo,
  rect,
  fitbox,
  ColorMatrix,
  Image,
  Atlas,
  ImageFormat,
} from '@shopify/react-native-skia';
import {
  Platform,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  runOnJS,
  runOnUI,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Slider} from 'react-native-awesome-slider';
import * as Animatable from 'react-native-animatable';
import {msToTime} from '../utils/util';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import Orientation from 'react-native-orientation-locker';
import {useBearStore} from '../../store/store';


const Video = () => {
  const textStamp = useRef(null);
  const setShowBar = useBearStore(state => state.setShowBar);
  const iconColor = '#fff';
  const iconSize = 32;
  const [pause, setPause] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [volumeControl, setVolumeControl] = useState(true);
  const {width, height} = useWindowDimensions();
  const [showControl, setShowControl] = useState(true);
  const seek = useSharedValue(0);
  const paused = useSharedValue(false);
  const volume = useSharedValue(1);
  const {currentFrame, currentTime, size, rotation, duration} = useVideo(
    // 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    {
      paused,
      looping: false,
      seek,
      volume,
    },
  );

  const src = rect(0, 0, size.width, size.height);
  const dst = rect(0, 0, width, height);
  const transform = fitbox('cover', src, dst, rotation);

  const derivedCurrentTime = useDerivedValue(() => currentTime?.value);

  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);
  const TIME = useSharedValue('00:00:00');

  const forwardThirty = () => {
    if (currentTime?.value + 30000 < duration) {
      seek.value = currentTime?.value + 30000;
      paused.value = false;
      const newSliderValue = (currentTime?.value + 30000) / duration;
      progress.value = newSliderValue;
      changeText();
      if (pause === true) {
        setPause(false);
      }
    } else {
      seek.value = duration - 2000;
      paused.value = true;

      setPause(true);
    }
  };

  const backwardThirty = () => {
    if (currentTime?.value - 30000 >= 0) {
      seek.value = currentTime?.value - 30000;
      paused.value = false;
      const newSliderValue = (currentTime?.value - 30000) / duration;
      progress.value = newSliderValue;

      if (pause === true) {
        setPause(false);
      }
    } else {
      seek.value = 0;
      TIME.value = '00:00:00';
      paused.value = false;
    }
  };

  useEffect(() => {
    if (showControl) {
      const timer = setTimeout(() => {
        // setShowControl(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showControl]);

  useEffect(() => {
    setShowControl(true);
    const timer = setTimeout(() => {
      // setShowControl(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (derivedCurrentTime.value / duration >= 0) {
        progress.value = derivedCurrentTime.value / duration;
        TIME.value = msToTime(derivedCurrentTime.value);
        changeText();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [derivedCurrentTime, duration]);

  const changeText = () => {
    if (textStamp?.current) {
      textStamp?.current?.setNativeProps({text: TIME.value});
    }
  };

  const copyFrameOnAndroid = current_Frame => {
    runOnUI(() => {
      'worklet';
      if (Platform.OS === 'android') {
        const tex = current_Frame.value;
        if (tex) {
          currentFrame.value = tex.makeNonTextureImage();
          tex.dispose();
        }
      }
    })();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
        <Animatable.View
          delay={1000}
          animation={showControl === true ? 'fadeIn' : 'fadeOut'}
          style={{
            position: 'absolute',
            top: zoom === true ? 5 : 90,
            right: 8,
            zIndex: 9999,
          }}>
          <TouchableOpacity
            disabled={showControl === true ? false : true}
            onPress={() => {
              setZoom(!zoom);
              zoom === false
                ? Orientation.lockToLandscape()
                : Orientation.lockToPortrait();
              zoom === false ? setShowBar(false) : setShowBar(true);
              // SystemNavigationBar.navigationHide();
              zoom === false
                ? SystemNavigationBar.fullScreen(true)
                : SystemNavigationBar.fullScreen(false);
              // SystemNavigationBar.setFitsSystemWindows(true);
            }}>
            <MaterialIcons
              name={zoom !== true ? 'zoom-out-map' : 'zoom-in-map'}
              size={iconSize}
              color={iconColor}
            />
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View
          delay={1000}
          animation={showControl === true ? 'fadeIn' : 'fadeOut'}
          style={{
            position: 'absolute',
            top: zoom === true ? 5 : 140,
            right: zoom === true ? 80 : 8,
            zIndex: 9999,
          }}>
          <TouchableOpacity
            disabled={showControl === true ? false : true}
            onPress={() => {
              setVolumeControl(!volumeControl);
              volumeControl === true ? (volume.value = 0) : (volume.value = 1);
            }}>
            <MaterialIcons
              name={volumeControl === true ? 'volume-up' : 'volume-off'}
              size={iconSize}
              color={iconColor}
            />
          </TouchableOpacity>
        </Animatable.View>

        <TouchableOpacity
          style={{
            height:400,
            // backgroundColor:'red',
          }}
          onPress={() => {
            setShowControl(!showControl);
          }}>
          <>
            <Canvas style={{flex:1}}>
              <Fill>
                <ImageShader
                  image={currentFrame}
                  x={0}
                  y={0}
                  width={width}
                  height={400}
                  fit={zoom === true ? 'cover' : 'contain'}
                />
               {/* <ColorMatrix
            matrix={zoom === true ?[
              0.95, 0, 0, 0, 0.05, 0.65, 0, 0, 0, 0.15, 0.15, 0, 0, 0, 0.5, 0,
              0, 0, 1, 0,
            ]:[]}
          /> */}
              </Fill>
            </Canvas>
          </>
        </TouchableOpacity>
        <Animatable.View
          delay={1000}
          animation={showControl === true ? 'fadeIn' : 'fadeOut'}
          style={{
            height: 50,
            position: 'absolute',
            top: zoom === true ? 360 : 280,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: width,
          }}>
          <TextInput
            editable={false}
            defaultValue={'00:00:00'}
            ref={textStamp}
            style={{
              color: '#fff',
              width: zoom === false ? '20%' : '10%',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <Slider
            disabled={showControl === true ? false : true}
            style={{
              width: zoom === false ? '60%' : '80%',
              height: 40,
            }}
            progress={progress}
            minimumValue={min}
            maximumValue={max}

            onSlidingStart={() => {
              paused.value = true;
            }}
            onSlidingComplete={e => {
              seek.value = e * duration;
              paused.value = false;
              setPause(false);
            }}
            heartbeat={true}
            theme={{
              disableMinTrackTintColor: '#fff',
              maximumTrackTintColor: '#fff',
              minimumTrackTintColor: 'red',
              cacheTrackTintColor: '#333',
              bubbleBackgroundColor: '#666',
              heartbeatColor: 'rgba(0,0,0,0.2)',
            }}
          />

          <TextInput
            editable={false}
            defaultValue={msToTime(duration)}
            style={{
              color: '#fff',
              width: zoom === false ? '20%' : '10%',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </Animatable.View>

        <Animatable.View
          delay={1000}
          animation={showControl === true ? 'fadeIn' : 'fadeOut'}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            position: 'absolute',
            top: zoom === true ? 200 : 200,
            left: 0,
            right: 0,
          }}>
          <TouchableOpacity
            disabled={showControl === true ? false : true}
            onPress={backwardThirty}>
            <MaterialIcons name="replay-30" size={iconSize} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={showControl === true ? false : true}
            onPress={() => {
              paused.value = !paused.value;
              paused.value === true ? setPause(false) : setPause(true);
              copyFrameOnAndroid(currentFrame);
            }}>
            <FontAwesome6
              name={pause === true ? 'play' : 'pause'}
              size={36}
              color={iconColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={showControl === true ? false : true}
            onPress={forwardThirty}>
            <MaterialIcons
              name="forward-30"
              size={iconSize}
              color={iconColor}
            />
          </TouchableOpacity>
        </Animatable.View>
   
    </View>
  );
};

export default Video;
