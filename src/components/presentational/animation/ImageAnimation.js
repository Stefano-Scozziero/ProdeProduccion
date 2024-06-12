import { StyleSheet, View, Animated, Easing, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef } from 'react'
import colors from '../../../utils/globals/colors'

const { width, height } = Dimensions.get('window')

const ImageAnimation = ({ style }) => {
  const pulseAnimation = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Pulsating background animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 0.95,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [pulseAnimation])

  return (
    <Animated.View style={[styles.loadingContainer, { transform: [{ scale: pulseAnimation }] }, style]}>
        <ActivityIndicator size={50} color={colors.white} />
    </Animated.View>
  )
}

export default ImageAnimation

const styles = StyleSheet.create({
  loadingContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blackGray,
  },
})
