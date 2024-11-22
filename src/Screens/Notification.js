import notifee, {
  AndroidBadgeIconType,
  AndroidImportance,
  AndroidStyle,
} from '@notifee/react-native';
import React, {useEffect} from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {darkTheme, lightTheme} from '../Style/theme';
import {windowWidth} from '../utils/util';

export default function Notification() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  useEffect(() => {
   
    requestNotificationPermission();
    batteryOptimizationEnabled();
  }, []);

  async function requestNotificationPermission() {
    const settings = await notifee.requestPermission();

    // Instead of accessing AuthorizationStatus, check for specific values directly
    if (settings.authorizationStatus === 0) {
      Alert.alert(
        'Notification Permission Denied',
        'Please enable notifications in settings to receive alerts.',
      );
    } else if (
      settings.authorizationStatus === 1 ||
      settings.authorizationStatus === 2
    ) {
      console.log('Notification permissions granted.');
    }
  }
  async function batteryOptimizationEnabled() {
    const batteryOptimizationEnabled =
      await notifee.isBatteryOptimizationEnabled();
      console.log('====================================');
      console.log('test');
      console.log('====================================');
    if (batteryOptimizationEnabled) {
      // 2. ask your users to disable the feature
      Alert.alert(
        'Restrictions Detected',
        'To ensure notifications are delivered, please disable battery optimization for the app.',
        [
          // 3. launch intent to navigate the user to the appropriate screen
          {
            text: 'OK, open settings',
            onPress: async () =>
              await notifee.openBatteryOptimizationSettings(),
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  }

  async function displayNotification() {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      badge: true,
    });

    await notifee.displayNotification({
      // title: 'Hello, There!',
      // body: 'This is a test notification.',
      // body: 'This is a <p style="color: #ffffff; background-color: #9c27b0"><i>test notification.</i></p>',

      // android: {
      //   channelId,
      //   smallIcon: 'ic_launcher_foreground',
      //   largeIcon: 'ic_launcher_round',
      //   color: '#E8210C',
      //   pressAction: {
      //     id: 'default',
      //     launchActivity: 'default',
      //   },
      //   badgeIconType: AndroidBadgeIconType.LARGE,
      // },

      title: '<p style="color: #4caf50;"><b>Hello, There!</span></p></b></p> ',
      subtitle: 'Skia Player',
      body: 'This is a test notification.',

      // body: 'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',

      android: {
        channelId,
        smallIcon: 'ic_launcher_foreground',
        largeIcon: 'ic_launcher_round',
        color: '#E8210C',
        style: {
          type: AndroidStyle.BIGTEXT,
          text: 'The full <i>expanded</i> version of the <b>styled</b> text.',
        },
        actions: [
          {
            title: '<b>Ok</b>',
            pressAction: {id: 'Ok'},
          },
          {
            title: '<p style="color: #f44336;"><b>Cancel</b></p>',
            pressAction: {id: 'Cancel'},
          },
        ],
        badgeIconType: AndroidBadgeIconType.LARGE,
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
      },
    });
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        style={{backgroundColor: theme.buttonColor, borderRadius: 12}}
        onPress={displayNotification}>
        <Text
          style={{
            padding: 12,
            width: windowWidth / 2,
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Show Notification
        </Text>
      </TouchableOpacity>
    </View>
  );
}
