import React from 'react';
import { Image, StyleSheet, Platform, View,Text, TextInput, KeyboardAvoidingView } from 'react-native';

import SearchInput  from '@/components/searchinput';

export default function HomeScreen() {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={[styles.largeText, styles.textStyle]}>San Francisco</Text>
      <Text style={[styles.smallText, styles.textStyle]}>Light Cloud</Text>
      <Text style={[styles.largeText, styles.textStyle]}>24°C</Text>

      <SearchInput placeholder="Search any city"></SearchInput>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
    alignItems: 'center',
    justifyContent:'center',
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'AvenirNext-Regular',
  },
  largeText: {
    fontSize: 44,
     },
    smallText: {
    fontSize: 18,
    },
});
