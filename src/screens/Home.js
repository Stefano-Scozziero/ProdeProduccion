import { TouchableOpacity, StyleSheet, ImageBackground, Image, View, Dimensions } from 'react-native'
import React from 'react'
import { OrientationContext } from '../utils/globals/context'
import { useContext } from 'react'

const { width, height } = Dimensions.get('window')

const Home = React.memo(({ navigation }) => {

  const portrait = useContext(OrientationContext)

  return (
    <ImageBackground source={require('../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
      <View style={styles.container}>
        <View style={styles.predictionContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Competencies')}>
            <Image style={styles.predictionImage} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Fmispredicciones.png?alt=media&token=ef9f815a-e80b-4f15-8981-4844c95695ad' }}  resizeMode='contain'/>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('TablaDeLideres')}>
            <Image style={styles.predictionImageRow} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Ftabladelideres.png?alt=media&token=6774c721-7422-40e7-b2e4-5373e17b50fe' }} resizeMode='contain'/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Fixture')}>
            <Image style={styles.predictionImageRow} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Ffixture.png?alt=media&token=299cb20e-6a51-4078-9ecd-374514047aaa' }} resizeMode='contain'/>
          </TouchableOpacity>
        </View>
        <View style={styles.predictionContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Noticias')}>
            <Image style={styles.predictionImage} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Fnoticias.png?alt=media&token=b6a17432-35b6-4845-9548-f4b8173c9401' }} resizeMode='contain'/>
          </TouchableOpacity>
        </View>
        
      </View>
    </ImageBackground>
  )
})

export default Home

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
  },
  mainLandScape: {
    flexDirection: 'row'
  },
  container: {
    width: '90%',
    height: '100%',
    top: 10
  },
  predictionContainer: {
    width: '100%',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictionImage: {
    width: width * 0.9,
    height: height * 0.2,
    borderRadius: 20
  },
  predictionImageRow: {
    width: width * 0.44,
    height: height * 0.2,
    borderRadius: 20
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
