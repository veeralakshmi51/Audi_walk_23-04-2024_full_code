if (__DEV__) {
    require("./ReactotronConfig");
  }
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import TabViewExample from './Src/Components/TabView';

AppRegistry.registerComponent(appName, () => App);
