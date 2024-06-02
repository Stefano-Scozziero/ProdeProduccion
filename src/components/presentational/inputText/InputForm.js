import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import colors from '../../../utils/globals/colors'
import { Entypo } from '@expo/vector-icons'

const InputForm = ({ label, value, onChangeText, isSecure, error }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible)
  }

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          secureTextEntry={isSecure && !isPasswordVisible}
          placeholder={label}
          placeholderTextColor={colors.white}
        />
        {isSecure && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
            <Entypo name={isPasswordVisible ? 'eye' : 'eye-with-line'} size={20} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

export default InputForm

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.white,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    color: colors.white,
    padding: 10,
    fontSize: 16,
  },
  iconContainer: {
    padding: 10,
  },
  error: {
    fontSize: 16,
    color: 'red',
    fontStyle: 'italic',
    textAlign: 'center',
  },
})
