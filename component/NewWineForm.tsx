import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '../auth/authContext';
import * as ImagePicker from 'expo-image-picker';
import { CustomController } from './input/CustomController';
import CustomCodBarScanner from './CustomBarCodeScanner';
import { adminwine_url } from '../config';

export default function NewWineForm() {

    const { user } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            cepages: [' '],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "cepages"
    });

    const [img, setImg] = useState("");
    const [isScanned, setIsScanned] = useState(false);
    const [code_barre, setCode_barre] = useState(0);
    const [hasPermission, setHasPermission] = useState(null);
    const [isInserted, setIsInserted] = useState(false)
    //let code_barre = "";
    const generateRandomString = (length = 24): string =>
        Array.from({ length }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 62))).join('');

    const onSubmit = async (data: any) => {
        let img_url = ""
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: img,
                type: 'image/jpeg',
                name: generateRandomString(24) + ".jpg", //random name of 24 char
            });
            const response = await fetch(`${adminwine_url}/add_image?token=${user["stsTokenManager"]["accessToken"]}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });
            const jsonResponse = await response.json();
            img_url = jsonResponse.name
        } catch (error) {
            console.error('Error uploading the image:', error);
        }
        const { cepages, years, percent, ...otherData } = data;
        const percentString = String(percent).replace(',', '.');
        const percentFloat = parseFloat(percentString);
        console.log("Code barre : " + code_barre)
        const newData = {
            new_field: { ...otherData },
            data: { years, percent: percentFloat, "code_barre": code_barre, img_url },
            cepage: cepages
        };
        try {
            const response = await fetch(`${adminwine_url}/insert_wine?token=${user["stsTokenManager"]["accessToken"]}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });
            const jsonResponse = await response.json();
            setIsInserted(true)
        } catch (error) {
            console.error('Error making the request:', error);
            alert('Error making the request');
        }
    };

    const handleSelectImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                setImg(result.assets[0].uri);
                console.log(result.assets[0].uri);
                return;
            }
            setImg("");
        } catch (error) {
            console.error("Error picking an image: ", error);
        }
    };

    const handleTakePicture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            console.log(result.assets[0].uri);
            setImg(result.assets[0].uri);
            return;
        }
        setImg("")

    };

    const handleBarCodeScanned = ({ type, data }) => {
        console.log(data);
        setCode_barre(data);
        //code_barre = data + "";
        console.log(code_barre)
        setIsScanned(true);
        console.log(code_barre)
    }

    return (
        <View style={!isScanned ? styles.container : styles.viewContainer }>
            { !isInserted ? 
             <View style={styles.container}>
            {!isScanned ?
                <View style={styles.container}>
                    <CustomCodBarScanner
                        scanned={isScanned}
                        setScanned={setIsScanned}
                        handleBarCodeScanned={handleBarCodeScanned}
                    />
                </View>
                :
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.viewContainer}>
                    <ScrollView style={styles.leftMargin}>
                        <View style={styles.formContainer}>
                            <CustomController title="Producer" control={control} name="productor" />
                            <CustomController title="Cuve" control={control} name="cuve" />
                            <CustomController title="Appellation" control={control} name="appellation" />
                            <CustomController title="Region" control={control} name="region" />
                            <CustomController title="Type" control={control} name="type" />
                            <CustomController title="Warning" control={control} name="warning" />
                            <CustomController title="Advice" control={control} name="advice" />
                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <CustomController title="Years" control={control} name="years" keyboardType="numeric" />
                                </View>
                                <View style={styles.column}>
                                    <CustomController customStyle={[styles.input, styles.flexInput]}  title="Percent" control={control} name="percent" keyboardType="numeric" />
                                </View>
                            </View>
                            <View style={styles.row}>
                                <Text>Cepage</Text>
                                <TouchableOpacity onPress={() => append(' ')}>
                                    <Text style={styles.addCepage}>Add Cepage</Text>
                                </TouchableOpacity>
                            </View>
                            {fields.map((field, index) => (
                                <View key={field.id} style={styles.row}>
                                    <CustomController customStyle={[styles.input, styles.flexInput]} control={control} name={`cepages[${index}]`} />
                                    <Button title="-" onPress={() => remove(index)} />
                                </View>
                            ))}
                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Button title="Add Picture" onPress={handleSelectImage} />
                                </View>
                                <View style={styles.column}>
                                    <Button title="Take Picture" onPress={handleTakePicture} />
                                </View>
                            </View>
                            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>}
                </View >
                :
                <Text>Wine inserted successfuly</Text>}
        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    viewContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '90%',
    },
    leftMargin: {
        marginLeft: '10%',
        paddingBottom: 150,

    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        
        borderRadius: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    column: {
        flex: 1,
        marginHorizontal: 5,
    },
    flexInput: {
        flex: 1,
    },
    focusedTextContainer: {
        backgroundColor: "white",
        zIndex: 999,
        position: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addCepage: {
        fontSize: 12
    },
    zIndexMax: {
        zIndex: 999,
    }
});