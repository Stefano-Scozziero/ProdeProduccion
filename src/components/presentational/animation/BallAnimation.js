import React from 'react'
import { View, Animated, Easing } from 'react-native'

const BallAnimation = () => {
  const spinValue = new Animated.Value(0)

  Animated.loop(
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }
    )
  ).start()

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg','0deg' ]
  })

  return (
    <View style={{ alignItems: 'center'}}>
      <Animated.Image
        source={require('../../../../assets/pelota.png')}
        style={{ width: 20, height: 20, transform: [{ rotate: spin }] }}
      />
    </View>
  )
}

export default BallAnimation
