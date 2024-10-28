import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import colors from '../../../utils/globals/colors';
import FastImage from 'react-native-fast-image';

// Asegúrate de que DEFAULT_IMAGE está definido
const DEFAULT_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2FiconEsc.png?alt=media&token=4c508bf7-059e-451e-b726-045eaf79beae';

const ImageLoader = ({ uri, style }) => {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    return (
        <View style={[style, styles.imageContainer]}>
            {loading && (
                <ActivityIndicator
                    size="small"
                    color={colors.orange}
                    style={styles.activityIndicator}
                />
            )}
            <FastImage
                style={[styles.image, loading && styles.imageHidden]}
                source={{
                    uri: error ? DEFAULT_IMAGE : uri,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
                onLoad={() => setLoading(false)}
                onError={(e) => {
                    console.log('Error cargando imagen:', e.nativeEvent.error);
                    setError(true);
                    setLoading(false);
                }}
            />
        </View>
    );
};

const DatesByKeys = ({ encuentros }) => {

    const renderFase = ({ item }) => (
        <View style={styles.roundContainer}>
            <Text style={styles.roundTitle}>{item.fase}</Text>
            <ScrollView contentContainerStyle={styles.phaseScrollContainer}>
                {item.encuentros.map((match, idx) => {
                    if (!match) return null; // Ignorar encuentros nulos
                    const team1Style = match.winner === 'equipo1' ? styles.winningTeam : styles.losingTeam;
                    const team2Style = match.winner === 'equipo2' ? styles.winningTeam : styles.losingTeam;

                    return (
                        <View key={idx} style={styles.matchContainer}>
                            <Card style={styles.card}>
                                <View style={[styles.teamRow, team1Style]}>
                                    <ImageLoader uri={match.imagen1} style={styles.teamImage} />
                                    <Text numberOfLines={1} style={styles.teamName}>
                                        {match.equipo1 || 'Por Definir'}
                                    </Text>
                                </View>
                                <View style={[styles.teamRow, team2Style]}>
                                    <ImageLoader uri={match.imagen2} style={styles.teamImage} />
                                    <Text numberOfLines={1} style={styles.teamName}>
                                        {match.equipo2 || 'Por Definir'}
                                    </Text>
                                </View>
                                <Text style={styles.score}>{`${match.goles1} - ${match.goles2}`}</Text>
                            </Card>
                        </View>
                    );
                })}
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
        alignItems: 'center',
        width: Dimensions.get('window').width * 0.7,
        borderRadius: 5,
    },
    roundTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
        color: colors.white,
    },
    phaseScrollContainer: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    matchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    card: {
        width: 250,
        height: 130, // Ajuste de altura para consistencia
        marginBottom: 10,
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 15,
        elevation: 5,
        justifyContent: 'space-between',
    },
    winningTeam: {
        backgroundColor: colors.green,
    },
    losingTeam: {
    },
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        padding: 5,
        borderRadius: 5
    },
    teamImage: {
        width: 30, // Aumentamos el tamaño para verificar
        height: 30,
        marginRight: 15,
    },
    teamName: {
        fontSize: 11,
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
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityIndicator: {
        position: 'absolute',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageHidden: {
        opacity: 0,
    },
});
