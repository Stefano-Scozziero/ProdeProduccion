import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/authStack/Login'
import Register from '../screens/authStack/Register'
import ForgotYourPass from '../screens/authStack/ForgotYourPass'

const Stack = createNativeStackNavigator()

const AuthStack = () => {
  return (
    <Stack.Navigator
        initialRouteName='Login'
        screenOptions={{
            headerShown: false,
            animationEnabled: false, // Desactiva animaciones para todas las transiciones en este stack
        }}
    >
        <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='ForgotYourPass' component={ForgotYourPass} />
    </Stack.Navigator>
  )
}

export default AuthStack