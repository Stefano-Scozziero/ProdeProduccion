import React, { useState, useContext, useEffect } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Image, 
  View, 
  Dimensions, 
  FlatList, 
  Text, 
  ActivityIndicator 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, setSelectedCategory } from '../../../features/category/categorySlice';
import { closeCategoriesModal, openCategoriesModal } from '../../../features/slice/uiSlice';
import { OrientationContext } from '../../../utils/globals/context';
import colors from '../../../utils/globals/colors';
import ImageAnimation from '../animation/ImageAnimation';
import CustomModal from '../modal/CustomModal'; 
import { CheckBox } from 'react-native-elements'; 

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

  // **Nuevo useEffect para seleccionar la primera categoría automáticamente**
  useEffect(() => {
    if (categoriesStatus === 'succeeded' && categories.length > 0 && !selectedCategory) {
      dispatch(setSelectedCategory(categories[0].title));
    }
  }, [categoriesStatus, categories, selectedCategory, dispatch]);

  const onRetry = () => {
    dispatch(fetchCategories());
  };

  const handleCategorySelect = (category) => {
    if (selectedCategory !== category.title) {
      dispatch(setSelectedCategory(category.title));
      dispatch(closeCategoriesModal());
      if (intendedNavigation) {
        navigation.navigate(intendedNavigation);
        setIntendedNavigation(null);
      }
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
          onPress={() => {
            if (!selectedCategory) {
              setIntendedNavigation('Predictions');
              dispatch(openCategoriesModal());
            } else {
              navigation.navigate('Predictions');
            }
          }}
          loading={loading}
          setLoading={setLoading}
        />
      </View>

      <View style={[styles.predictionContainerRow, !portrait && styles.predictionContainerRowLandScape]}>
        <ImageLoader
          uri="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Ftabladelideres.png?alt=media&token=6774c721-7422-40e7-b2e4-5373e17b50fe"
          style={[styles.predictionImageRow, !portrait && styles.predictionImageRowLandScape]}
          onPress={() => {
            if (!selectedCategory) {
              setIntendedNavigation('Leader');
              dispatch(openCategoriesModal());
            } else {
              navigation.navigate('Leader');
            }
          }}
          loading={loading}
          setLoading={setLoading}
        />
        <ImageLoader
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
          loading={loading}
          setLoading={setLoading}
        />
      </View>
      
      <View style={[styles.predictionContainer, !portrait && styles.predictionContainerLandScape]}>
        <ImageLoader
          uri="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Fkeys.png?alt=media&token=30c64f04-0bbf-433a-a11f-1d281f081c51"
          style={[styles.predictionImage, !portrait && styles.predictionImageLandScape]}
          onPress={() => navigation.navigate('Keys')}
          loading={loading}
          setLoading={setLoading}
        />
      </View>

      <View style={[styles.predictionContainer, !portrait && styles.predictionContainerLandScape]}>
        <ImageLoader
          uri="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2Fnoticias.png?alt=media&token=b6a17432-35b6-4845-9548-f4b8173c9401"
          style={[styles.predictionImage, !portrait && styles.predictionImageLandScape]}
          onPress={() => navigation.navigate('News')}
          loading={loading}
          setLoading={setLoading}
        />
      </View>

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
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedCategory === item.title;
              return (
                <TouchableOpacity 
                  onPress={() => handleCategorySelect(item)} 
                  style={styles.categoryItemContainer}
                >
                  <CheckBox
                    checked={isSelected}
                    onPress={() => handleCategorySelect(item)}
                    containerStyle={styles.checkboxContainer}
                    checkedColor={colors.orange}
                    uncheckedIcon="circle-o"       // Icono circular deseleccionado
                    checkedIcon="dot-circle-o"     // Icono circular seleccionado
                    iconType="font-awesome"        // Tipo de icono
                  />
                  <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={<Text>No hay Competencias disponibles.</Text>}
          />
        )}
      </CustomModal>
    </ImageBackground>
  );
});

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
  },
  predictionContainer: {
    width: width * 0.95,
    height: height * 0.17,
    marginTop: 10
  },
  predictionContainerRow: {
    width: width * 0.95,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between'
  },
  predictionImage: {
    width: width * 0.95,
    height: height * 0.17,
    borderRadius: 10,
  },
  predictionImageRow: {
    width: width * 0.465,
    height: height * 0.17,
    borderRadius: 10,
  },
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
  predictionContainerRowLandScape: {
    width: width * 0.90,
  },
  categoryItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: 10,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  categoryText: {
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    color: colors.black, 
  },
  selectedCategoryText: {
    color: colors.orange, 
    fontWeight: 'bold',
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
});
