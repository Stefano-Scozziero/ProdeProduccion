// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { fontsCollections } from './src/utils/globals/fonts';
import { OrientationProvider } from './src/utils/globals/context';
import { Provider } from 'react-redux';
import { store, persistor } from './src/app/store'; // Importa persistor
import MainNavigator from './src/navigation/MainNavigator';
import colors from './src/utils/globals/colors';
import { init } from './src/utils/db';
import { configureGoogleSignIn } from './src/app/services/authGoogle/config';
import { PersistGate } from 'redux-persist/integration/react'; // Importa PersistGate
import { ActivityIndicator, View } from 'react-native';

init();
configureGoogleSignIn();

const App = () => {
  let [fontsLoaded] = useFonts(fontsCollections);

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
        >
          <MainNavigator />
        </PersistGate>
      </Provider>
    </OrientationProvider>
  );
};

export default App;
