import { GoogleSignin } from '@react-native-google-signin/google-signin'

export const configuration = () => {

    GoogleSignin.configure({ // Configura GoogleSignin
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        webClientId: '1021676695100-qroipohh5224c89pi8itqtks4i7f2aeo.apps.googleusercontent.com',
      })
}
