import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { deleteSession, fetchSession } from '../utils/db'
import { setUser, clearUser, setAdmin } from '../features/auth/authSlice'
import DrawerNavigator from './DrawerNavigator'
import AuthStack from './AuthStack'
import LoadingScreen from '../components/presentational/LoadingSpinner'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'
import { db } from '../app/services/firebase/config'

const MainNavigator = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth)
    const [isLoading, setIsLoading] = useState(true)

  const checkIfAdmin = async (userId) => {
    const adminRef = db.ref(`admins/${userId}`)
    const snapshot = await adminRef.once('value')
    return snapshot.exists()
  }

  useEffect(() => {
    (async () => {
      try {
        const session = await fetchSession()
        if (session.rows.length > 0) {
          const now = Math.floor(Date.now() / 1000)
          const { updateAt, ...userData } = session.rows._array[0]
          const sessionTime = now - updateAt
          if (sessionTime < 3600) {
            dispatch(setUser(userData))
            const isAdmin = await checkIfAdmin(userData.localId)
            dispatch(setAdmin(isAdmin))
          } else {
            dispatch(clearUser())
            deleteSession()
            if (auth().currentUser) {
              await GoogleSignin.signOut()
            }
          }
        } else {
          dispatch(clearUser())
          deleteSession()
          if (auth().currentUser) {
            await GoogleSignin.signOut()
          }
        }
      } catch (error) {
        console.error('Failed to fetch session', error)
      }
      setIsLoading(false)
    })()
  }, [dispatch])

  if (isLoading) {
    return <LoadingScreen />
  }

    return (
        <NavigationContainer>
            {user.idToken ? <DrawerNavigator /> : <AuthStack />}
        </NavigationContainer>
    )
}

export default MainNavigator
