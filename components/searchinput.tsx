import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';



export default function searchinput({ placeholder, onSubmit }) {
    const [text, setText] = useState('');
  
    const handleChangeText = (newText:string) => {
      setText(newText);
    };
  
    const handleSubmitEditing = () => {
      if (!text) return;
      onSubmit(text);
      setText(''); // Clear the input after submission
    };
  
    return (
      <View style={styles.container}>
        <TextInput
          autoCorrect={true}
          placeholder={placeholder}
          placeholderTextColor="lightgray"
          underlineColorAndroid="transparent"
          selectionColor="white"
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
          style={styles.textInput}
          clearButtonMode="always"
          value={text}
        />
      </View>
    );
   
  };
  searchinput.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    };



const styles=StyleSheet.create({
    container: {
        height: 40,
        marginTop: 20,
        backgroundColor: 'transparent',
        marginHorizontal: 40,
        paddingHorizontal: 10,
        borderRadius: 5,
        },

        textInput:{
            flex: 1,
            color: 'white',
            fontSize:20,
        },
        
});