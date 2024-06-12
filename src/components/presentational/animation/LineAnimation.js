import React from 'react'
import { View, Animated, Easing } from 'react-native'
import colors from '../../../utils/globals/colors'

const LineAnimation = () => {
  const moveValue = new Animated.Value(0)

  Animated.loop(
    Animated.sequence([
      Animated.timing(
        moveValue,
        {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }
      ),
      Animated.timing(
        moveValue,
        {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }
      )
    ])
  ).start()

  const move = moveValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-5, 5]
  })

  return (
    <Animated.View
      style={{ width: 8, height: 3, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', transform: [{ translateX: move }] }}
    />
  )
}

export default LineAnimation
