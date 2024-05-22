import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomHeader from '../components/headers/CustomHeader'
import Competencies from '../components/presentational/stackProde/Competencies'
import MyPrediction from '../components/presentational/MyPrediction'

const Stack = createNativeStackNavigator()
const PredictionStack = () => {

  
  return (
    <Stack.Navigator
        initialRouteName='Prediction'
        screenOptions={({navigation, route})=>{
            return {
                header: () => {
                    return <CustomHeader 
                            title={route.name === "Prediction" ? "Predicciones" : "Detalle"} 
                            navigation={navigation}
                            />                
                }
            }
        }}

    >
        <Stack.Screen name='Competencies' component={Competencies}/>
        <Stack.Screen name='MyPrediction' component={MyPrediction}/>
    </Stack.Navigator>
  )
}

export default PredictionStack