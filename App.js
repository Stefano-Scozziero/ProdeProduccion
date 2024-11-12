import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { fontsCollections } from './src/utils/globals/fonts';
import { OrientationProvider } from './src/utils/globals/context';
import { Provider } from 'react-redux';
import { store, persistor } from './src/app/store';
import MainNavigator from './src/navigation/MainNavigator';
import colors from './src/utils/globals/colors';
import { init } from './src/utils/db';
import { configureGoogleSignIn } from './src/app/services/authGoogle/config';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import {
  requestUserPermission,
  subscribeToTopic,
  unsubscribeFromTopic,
  handleForegroundNotification,
  handleNotificationOpenedApp,
} from './src/components/logical/handlerNotification';

init();
configureGoogleSignIn();

const App = () => {
  let [fontsLoaded] = useFonts(fontsCollections);
  const navigationRef = useRef();
  const [isRehydrated, setIsRehydrated] = useState(false);

  useEffect(() => {
    if (isRehydrated) {
      const initializeApp = async () => {
        const permissionGranted = await requestUserPermission();
        if (permissionGranted) {
          const state = store.getState();
          const subscriptions = state.subscription.topics;

          for (const topic in subscriptions) {
            if (subscriptions[topic]) {
              await subscribeToTopic(topic);
            } else {
              await unsubscribeFromTopic(topic);
            }
          }
        } else {
          console.log('El usuario denegó los permisos de notificación');
        }

        handleForegroundNotification();
        handleNotificationOpenedApp(navigationRef);
      };

      initializeApp();
    }
  }, [isRehydrated]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <OrientationProvider>
      <StatusBar backgroundColor={colors.black} style="light" />
      <Provider store={store}>
        <PersistGate
          loading={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          }
          persistor={persistor}
          onRehydrated={() => setIsRehydrated(true)}
        >
          <NavigationContainer ref={navigationRef}>
            <MainNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </OrientationProvider>
  );
};

export default App;
