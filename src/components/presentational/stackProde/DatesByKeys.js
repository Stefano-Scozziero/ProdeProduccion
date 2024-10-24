import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import colors from '../../../utils/globals/colors';

// URL predeterminada desde Firebase Storage
const DEFAULT_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2FiconEsc.png?alt=media&token=4c508bf7-059e-451e-b726-045eaf79beae';

const ImageLoader = ({ uri, style }) => {
    const [loading, setLoading] = useState(true);
 
    return (
       <View>
          {loading && <ActivityIndicator size="small" color={colors.orange} />}
          <Image
             source={{ uri }}
             style={[style, loading && { display: 'none' }]}
             resizeMode="contain"
             onLoad={() => setLoading(false)}
             onError={(error) => console.log('Error cargando imagen:', error.nativeEvent.error)}
          />
       </View>
    );
 };

 

 
const DatesByKeys = ({ encuentros }) => {
    const renderFase = ({ item }) => (
        <View style={styles.roundContainer}>
            <Text style={styles.roundTitle}>{item.fase}</Text>
            <ScrollView contentContainerStyle={styles.phaseScrollContainer}>
                {item.encuentros.map((match, idx) => (
                    <View key={idx} style={styles.matchContainer}>
                        <Card style={styles.card}>
                            <View style={styles.teamRow}>
                                <ImageLoader uri={match.imagen1 || DEFAULT_IMAGE} style={styles.teamImage} />
                                <Text numberOfLines={1} style={styles.teamName}>
                                    {match.equipo1 || 'Por Definir'}
                                </Text>
                            </View>
                            <View style={styles.teamRow}>
                                <ImageLoader uri={match.imagen2 || DEFAULT_IMAGE} style={styles.teamImage} />
                                <Text numberOfLines={1} style={styles.teamName}>
                                    {match.equipo2 || 'Por Definir'}
                                </Text>
                            </View>
                            <Text style={styles.score}>{`${match.goles1} - ${match.goles2}`}</Text>
                        </Card>
                    </View>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <FlatList
            data={encuentros}
            renderItem={renderFase}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
        />
    );
};

export default DatesByKeys;

const styles = StyleSheet.create({
    flatListContainer: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    roundContainer: {
        marginHorizontal: 5,
        alignItems: 'center',
        width: Dimensions.get('window').width * 0.7, // Ancho de cada fase en el FlatList
    },
    roundTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
        color: colors.orange,
    },
    phaseScrollContainer: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    matchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    card: {
        width: 250,
        height: 110, // Ajuste de altura para consistencia
        marginBottom: 10,
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 15,
        elevation: 5,
        justifyContent: 'space-between',
    },
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    teamImage: {
        width: 30, // Aumentamos el tamaño para verificar
        height: 30,
        borderRadius: 25, // Imagen circular
        marginRight: 15,
    },
    teamName: {
        fontSize: 13,
        color: colors.black,
        flexShrink: 1, // Evitar que el texto desborde
    },
    score: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black,
    },
    line: {
        marginLeft: 10,
    },
});
