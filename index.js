/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';

// import { registerRootComponent } from 'expo';
import {name as appName} from './app.json';
import App from './src/App';


AppRegistry.registerComponent(appName, () => App);
