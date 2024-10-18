<<<<<<< HEAD
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
=======
import React, { useState, useContext, useEffect } from 'react';
import {TouchableOpacity, StyleSheet, ImageBackground, Image, View, Dimensions, FlatList, Text, ActivityIndicator} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, setSelectedCategory } from '../../../features/category/categorySlice';
import { closeCategoriesModal, openCategoriesModal } from '../../../features/slice/uiSlice';
import { OrientationContext } from '../../../utils/globals/context';
import colors from '../../../utils/globals/colors'
import ImageAnimation from '../animation/ImageAnimation';
import CustomModal from '../modal/CustomModal'; // Importa tu modal personalizado

const { width, height } = Dimensions.get('window');

const ImageLoader = ({ uri, style, onPress, loading, setLoading }) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
    {loading && <ImageAnimation style={style} />}
    <Image
      style={[style, loading && { display: 'none' }]}
      source={{ uri }}
      resizeMode="stretch"
      onLoad={() => setLoading(false)}
    />
  </TouchableOpacity>
);

const Home = React.memo(({ navigation }) => {
  const portrait = useContext(OrientationContext);
  const dispatch = useDispatch();
  const selectedCategory = useSelector(state => state.category.selectedCategory);
  const categories = useSelector(state => state.category.categories);
  const categoriesStatus = useSelector(state => state.category.status);
  const categoriesError = useSelector(state => state.category.error);
  const isCategoriesModalVisible = useSelector(state => state.ui.isCategoriesModalVisible);
  const [loading, setLoading] = useState(true);
  const [intendedNavigation, setIntendedNavigation] = useState(null);

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  const onRetry = () => {
    dispatch(fetchCategories());
  };

  const handleCategorySelect = (category) => {
    dispatch(setSelectedCategory(category.title));
    dispatch(closeCategoriesModal());
    if (intendedNavigation) {
      navigation.navigate(intendedNavigation);
      setIntendedNavigation(null);
    }
  };

  return (
    <ImageBackground
      source={require('../../../../assets/fondodefinitivo.png')}
      style={[styles.main, !portrait && styles.mainLandScape]}
    >
      <View style={[styles.predictionContainer, !portrait && styles.predictionContainerLandScape]}>
        <ImageLoader
          uri="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Fmispredicciones.png?alt=media&token=ef9f815a-e80b-4f15-8981-4844c95695ad"
          style={[styles.predictionImage, !portrait && styles.predictionImageLandScape]}
>>>>>>> testing/master
          onPress={() => navigation.navigate('Competencies')}
          loading={loading}
          setLoading={setLoading}
        />
      </View>
<<<<<<< HEAD
      <View style={styles.buttonRow}>
        <ImageLoader
          uri='https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Ftabladelideres.png?alt=media&token=6774c721-7422-40e7-b2e4-5373e17b50fe'
          style={styles.predictionImageRow}
          onPress={() => navigation.navigate('LeaderBoard')}
=======

      <View style={[styles.buttonRow, !portrait && styles.buttonRowLandScape]}>
        <ImageLoader
          uri="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Ftabladelideres.png?alt=media&token=6774c721-7422-40e7-b2e4-5373e17b50fe"
          style={[styles.predictionImageRow, !portrait && styles.predictionImageRowLandScape]}
          onPress={() => {
            if (!selectedCategory) {
              setIntendedNavigation('LeaderBoard');
              dispatch(openCategoriesModal());
            } else {
              navigation.navigate('LeaderBoard');
            }
          }}
>>>>>>> testing/master
          loading={loading}
          setLoading={setLoading}
        />
        <ImageLoader
<<<<<<< HEAD
          uri='https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Ffixture.png?alt=media&token=299cb20e-6a51-4078-9ecd-374514047aaa'
          style={styles.predictionImageRow}
          onPress={() => navigation.navigate('Fixture')}
=======
          uri="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Ffixture.png?alt=media&token=299cb20e-6a51-4078-9ecd-374514047aaa"
          style={[styles.predictionImageRow, !portrait && styles.predictionImageRowLandScape]}
          onPress={() => {
            if (!selectedCategory) {
              setIntendedNavigation('Fixture');
              dispatch(openCategoriesModal());
            } else {
              navigation.navigate('Fixture');
            }
          }}
>>>>>>> testing/master
          loading={loading}
          setLoading={setLoading}
        />
      </View>
<<<<<<< HEAD
      <View style={styles.predictionContainer}>
        <ImageLoader
          uri='https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Fnoticias.png?alt=media&token=b6a17432-35b6-4845-9548-f4b8173c9401'
          style={styles.predictionImage}
=======

      <View style={[styles.predictionContainer, !portrait && styles.predictionContainerLandScape]}>
        <ImageLoader
          uri="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Fnoticias.png?alt=media&token=b6a17432-35b6-4845-9548-f4b8173c9401"
          style={[styles.predictionImage, !portrait && styles.predictionImageLandScape]}
>>>>>>> testing/master
          onPress={() => navigation.navigate('News')}
          loading={loading}
          setLoading={setLoading}
        />
      </View>
<<<<<<< HEAD
=======

      {/* Reemplazo del Modal por CustomModal */}
      <CustomModal
        modalVisible={isCategoriesModalVisible}
        onClose={() => dispatch(closeCategoriesModal())}
        text="Competencias:"
        secondaryButtonText="Cerrar"
        onPrimaryAction={() => dispatch(closeCategoriesModal())}
      >
        {categoriesStatus === 'loading' && <ActivityIndicator size="large" color="#0000ff" />}
        {categoriesStatus === 'failed' && (
          <View>
            <Text>Error: {categoriesError}</Text>
            <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}
        {categoriesStatus === 'succeeded' && (
          <FlatList
            data={categories}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCategorySelect(item)} style={styles.categoryItem}>
                <Text style={styles.categoryText}>{item.title}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>No hay categorías disponibles.</Text>}
          />
        )}
      </CustomModal>
>>>>>>> testing/master
    </ImageBackground>
  );
});

<<<<<<< HEAD
export default Home
=======
export default Home;
>>>>>>> testing/master

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
<<<<<<< HEAD
  mainLandScape: {
    flexDirection: 'row',
  },
=======
>>>>>>> testing/master
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
<<<<<<< HEAD
=======
  predictionContainerLandScape: {
    width: width * 0.95,
    height: width * 0.18,
    top: height * 0.025,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  predictionImageLandScape: {
    width: width * 0.90,
    height: height * 0.25,
    borderRadius: 10,
  },
  predictionImageRowLandScape: {
    width: width * 0.440,
    height: width * 0.15,
    borderRadius: 10,
  },
  buttonRowLandScape: {
    width: width * 0.90,
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.blackgray,
  },
  categoryText: {
    fontSize: 18,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
>>>>>>> testing/master
});
