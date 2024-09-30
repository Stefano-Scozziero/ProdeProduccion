import 'react-native-gesture-handler';
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { fontsCollections } from './src/utils/globals/fonts'
import { OrientationProvider} from './src/utils/globals/context'
import { Provider } from 'react-redux'
import { store } from './src/app/store'
import MainNavigator from './src/navigation/MainNavigator'
import colors from './src/utils/globals/colors'
import { init } from './src/utils/db'
import { configureGoogleSignIn } from './src/app/services/authGoogle/config'


init()
configureGoogleSignIn()

const App = () => {

  let [fontsLoaded] = useFonts(fontsCollections);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <OrientationProvider>
        <StatusBar backgroundColor={colors.black} style='light'/>
        <Provider store={store}>
          <MainNavigator/>
        </Provider>
      </OrientationProvider>
    </>
  )
}

export default App