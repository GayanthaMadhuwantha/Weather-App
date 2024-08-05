import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function custombutton({ title, onPress }){
    return(
        <TouchableOpacity onPress={onPress} style={[styles.button]}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: 'transparent', // Customize your button color
      borderRadius: 5,
      position:'relative',
      bottom:-10,
      right:-120,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });