import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function viewbutton({ title, onPress }){
    return(
        <TouchableOpacity onPress={onPress} style={[styles.button]}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: 'transparent', // Customize your button color
      alignItems: 'center',
    justifyContent: 'center',

    },
    buttonText: {
      color: '#009FBD',
      fontSize: 18,
    },
  });