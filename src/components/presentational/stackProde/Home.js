import { TouchableOpacity, StyleSheet, ImageBackground, Image, View, Dimensions } from 'react-native'
import React, { useState, useContext } from 'react'
import { OrientationContext } from '../../../utils/globals/context'
import ImageAnimation from '../animation/ImageAnimation'

const { width, height } = Dimensions.get('window')

const ImageLoader = ({ uri, style, onPress, loading, setLoading }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      {loading && <ImageAnimation style={style} />}
      <Image
        style={[style, loading && { display: 'none' }]}
        source={{ uri }}
        resizeMode='stretch'
        onLoad={() => setLoading(false)}
      />
    </TouchableOpacity>
  );
};

const Home = React.memo(({ navigation }) => {
  const portrait = useContext(OrientationContext);
  const [loading, setLoading] = useState(true);

  return (
    <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
      <View style={styles.predictionContainer}>
        <ImageLoader
          uri='https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Fmispredicciones.png?alt=media&token=ef9f815a-e80b-4f15-8981-4844c95695ad'
          style={styles.predictionImage}
          onPress={() => navigation.navigate('Competencies')}
          loading={loading}
          setLoading={setLoading}
        />
      </View>
      <View style={styles.buttonRow}>
        <ImageLoader
          uri='https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Ftabladelideres.png?alt=media&token=6774c721-7422-40e7-b2e4-5373e17b50fe'
          style={styles.predictionImageRow}
          onPress={() => navigation.navigate('LeaderBoard')}
          loading={loading}
          setLoading={setLoading}
        />
        <ImageLoader
          uri='https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Ffixture.png?alt=media&token=299cb20e-6a51-4078-9ecd-374514047aaa'
          style={styles.predictionImageRow}
          onPress={() => navigation.navigate('Fixture')}
          loading={loading}
          setLoading={setLoading}
        />
      </View>
      <View style={styles.predictionContainer}>
        <ImageLoader
          uri='https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Fnoticias.png?alt=media&token=b6a17432-35b6-4845-9548-f4b8173c9401'
          style={styles.predictionImage}
          onPress={() => navigation.navigate('News')}
          loading={loading}
          setLoading={setLoading}
        />
      </View>
    </ImageBackground>
  );
});

export default Home

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  mainLandScape: {
    flexDirection: 'row',
  },
  predictionContainer: {
    width: width * 0.95,
    height: width * 0.45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictionImage: {
    width: width * 0.95,
    height: height * 0.2,
    borderRadius: 10,
  },
  predictionImageRow: {
    width: width * 0.465,
    height: width * 0.45,
    borderRadius: 10,
  },
  buttonRow: {
    width: width * 0.95,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
