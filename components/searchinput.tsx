import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function searchinput(props: { placeholder: string | undefined; }){
    return(
        <View style={styles.container}>
            <TextInput autoCorrect={false} placeholder={props.placeholder} 
            placeholderTextColor="lightgray" underlineColorAndroid="transparent" 
            style={styles.textInput} clearButtonMode="always" />
        </View>
    );
}

const styles=StyleSheet.create({
    container: {
        height: 40,
        marginTop: 20,
        backgroundColor: '#666',
        marginHorizontal: 40,
        paddingHorizontal: 10,
        borderRadius: 5,
        },

        textInput:{
            flex: 1,
            color: 'white',
        },
        
});