/**
 * @format
 */

import {AppRegistry} from 'react-native';

// import { registerRootComponent } from 'expo';
import App from './src/Screens/App';
import {name as appName} from './app.json';
import Start from './src/Start';

// registerRootComponent(App);

AppRegistry.registerComponent(appName, () => Start);
