// NotificationHandler.js

import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

export async function requestUserPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

export async function subscribeToTopic(topic) {
  try {
    await messaging().subscribeToTopic(topic);
  } catch (error) {
    console.error('Error al suscribirse al tópico:', error);
  }
}
export async function unsubscribeFromTopic(topic) {
  try {
    await messaging().unsubscribeFromTopic(topic);
  } catch (error) {
    console.error('Error al desuscribirse del tópico:', error);
  }
}


export function handleForegroundNotification() {
  messaging().onMessage(async remoteMessage => {
    // Si no deseas mostrar una alerta o notificación, puedes dejar este bloque vacío
    // O bien, puedes manejar la notificación de manera silenciosa
    // Opcionalmente, puedes mostrar una notificación local usando una librería como 'notifee' o 'react-native-push-notification'
  });
}


export function handleBackgroundNotification() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    // Manejar la notificación en segundo plano si es necesario
  });
}

// NotificationHandler.js

export function handleNotificationOpenedApp(navigationRef) {
  // Cuando la aplicación está en background y se abre desde una notificación
  messaging().onNotificationOpenedApp(remoteMessage => {
    const { matchId, type } = remoteMessage.data;
    // Navegar a una pantalla específica
    if (type === 'gol') {
      navigationRef.current?.navigate('Notificaciones', { matchId });
    }
  });

  // Cuando la aplicación está cerrada y se abre desde una notificación
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        const { matchId, type } = remoteMessage.data;
        // Navegar a una pantalla específica
        if (type === 'gol') {
          navigationRef.current?.navigate('Notificaciones', { matchId });
        }
      }
    });
}

