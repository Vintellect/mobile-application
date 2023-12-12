import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../auth/authContext';
import { wine_url } from '../config';

export default function CustomAutoComplete(props) {
    const { type } = props;
    const [inputText, setInputText] = useState('');
    const [suggestions, setSuggestions] = useState([]);


    const handleChange = async (text) => {
        setInputText(text);
    
        if (text.length > 2) {
            try {
                const url = `${wine_url}/like/${type}?value=${text}`;
                const response = await fetch(url);
                const data = await response.json();
                console.log(suggestions)
                setSuggestions(data);
                // datav example:  LOG  [[0, "Domaine du paternel"], [14, "Domaine de Châteaumar"], [16, "Domaine de Châteaumar"]]
            } catch (error) {
                console.error('Error fetching data: ', error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]); 
        }
    }

    const handleSelectSuggestion = (suggestion) => {
        console.log(suggestion)
        setInputText(suggestion); 
        setSuggestions([]);
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={(text) => handleChange(text)}
            />
            <FlatList
                data={suggestions}
                keyExtractor={( item ) => item[0].toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.suggestionItem}
                        onPress={() => handleSelectSuggestion(item)}
                    >
                        <Text>{item[1]}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 40,
        margin: "10%",
        borderWidth: 1,
        padding: 10,
        width: '80%', // Adjust width as needed
    },
    suggestionItem: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    }
});
