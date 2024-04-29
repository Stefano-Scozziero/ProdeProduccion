import React, { useEffect, useState, useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { deleteSession, fetchSession } from '../utils/db'
import { setUser, clearUser } from '../features/auth/authSlice'
import DrawerNavigator from './DrawerNavigator'
import AuthStack from './AuthStack'
import LoadingScreen from '../components/presentational/LoadingSpinner'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'

const MainNavigator = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth)
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState({})
    const currentUser = auth().currentUser

    useEffect(() => {
    (async () => {
        try {
            const session = await fetchSession()
            if (session.rows.length > 0) {
                const now = Math.floor(Date.now() / 1000)
                const { updateAt, ...userData } = session.rows._array[0]
                const sessionTime = now - updateAt
                console.log(sessionTime)
                setProfile({
                    email: currentUser.email 
                })
                if (sessionTime < 3600) {
                    dispatch(setUser(userData))
                } else {
                    dispatch(clearUser())
                    deleteSession()
                    if(profile?.email !== null){
                        await GoogleSignin.signOut()
                    }
                }
            } else {
                dispatch(clearUser())
                deleteSession()
                if(profile?.email !== null){
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
