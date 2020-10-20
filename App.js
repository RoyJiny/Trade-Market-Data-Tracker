import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';

import store from './store';

import HomeScreen from './screens/HomeScreen';
import AddScreen from './screens/AddScreen';
import SettingsScreen from './screens/SettingsScreen';

const stackNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Add: AddScreen,
    Settings: SettingsScreen
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#F5F5F5',
        shadowColor: 'transparent',
        elevation: 0
      }
    }
  }
);

const App = createAppContainer(stackNavigator);

export default () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};