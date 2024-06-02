import React from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, Image } from 'react-native'
import ButtonPrimary from '../buttons/ButtonModal'
import colors from '../../../utils/globals/colors'
import fonts from '../../../utils/globals/fonts'
import { Entypo } from '@expo/vector-icons'

const ModalCamera = ({ textCamera, textGallery, textButton, onclose, modalVisible, pickImage }) => {
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType='fade'
      onRequestClose={onclose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <View style={{alignItems: 'center', margin: 20}}>
                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center',   height: 60}} onPress={() => pickImage(false)}>
                        
                        <View style={{justifyContent: 'center',   height: 50}}>
                            <Entypo size={50} name='images' color={colors.white}/>
                            <Text style={styles.text}>{textGallery}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems: 'center', margin: 20}}>
                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center',   height: 60}} onPress={() => pickImage(true)}>
                        
                        <View style={{justifyContent: 'center', alignItems: 'center',   height: 50}}>
                            <Entypo size={53} name='camera' color={colors.white}/>
                            <Text style={styles.text}>{textCamera}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
          <ButtonPrimary title={textButton} onPress={onclose} />
        </View>
      </View>
    </Modal>
  )
}

export default ModalCamera

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.orange,
    padding: 30,
    gap: 20,
    borderRadius: 30,
  },
  text: {
    fontSize: 16,
    color: 'white',
    fontFamily: fonts.robotoBold,
    textAlign: 'center'
  },
})
