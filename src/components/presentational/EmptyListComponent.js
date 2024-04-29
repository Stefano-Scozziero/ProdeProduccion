import { View, Text, StyleSheet, ImageBackground} from 'react-native'

const EmptyListComponent = ({message}) => {

  return (
    <ImageBackground source={require('../../../assets/fondodefinitivo.png')} style={styles.container}>
      <Text style={styles.errorMessage}>{message}</Text>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
})

export default EmptyListComponent