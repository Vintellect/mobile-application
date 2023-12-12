import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Modal, Text, Pressable } from 'react-native';
import { WineCard } from './WineCard';
import Feedback from './Feedback';
import { wine_url, bucket_url } from '../config';
const fetchWines = async () => {
    try {
        let response = await fetch(wine_url+'/getAllWine', {
            method: 'POST',
        });

        let json = await response.json();
        //console.log(json);
        return json; // This should be the array of wines
    } catch (error) {
        console.error(error);
    }
};

export default function WineList() {
    const [wines, setWines] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentWine, setCurrentWine] = useState(null);

    useEffect(() => {
        const getWines = async () => {
            const winesData = await fetchWines();
            setWines(winesData);
        };

        getWines();
    }, []);

    const toggleModal = (wine) => {    
        setCurrentWine(wine);
        setIsModalVisible(!isModalVisible);
    }

    

    return (
        <ScrollView style={styles.back}>
            <View>
                {wines.map((wine, index) => (
                    <Pressable
                        key={index}
                        onPress={() => toggleModal(wine)}
                    >
                        <WineCard
                            key={index}
                            year={wine[0]}
                            percent={wine[2]}
                            advice={wine[3]}
                            appellation={wine[4]}
                            region={wine[5]}
                            type={wine[6]}
                            warning={wine[7]}
                            producer={wine[9]}
                            img_url={`${bucket_url}/${wine[10]}`}
                            cepage={wine[11]}
                        />
                    </Pressable>
                ))}
            </View>
            {currentWine &&
            <Modal
                animationType='slide'
                transparent={false}
                visible={isModalVisible}
                onRequestClose={() => toggleModal(null)}
                style={styles.container}
                >
                <ScrollView>
                    <WineCard                        
                        year={currentWine[0]}
                        percent={currentWine[2]}
                        advice={currentWine[3]}
                        appellation={currentWine[4]}
                        region={currentWine[5]}
                        type={currentWine[6]}
                        warning={currentWine[7]}
                        producer={currentWine[9]}
                        img_url={`${bucket_url}/${currentWine[10]}`}
                        cepage={currentWine[11]}
                    />
                    <Feedback
                        currentWine={currentWine}
                    />
                </ScrollView>
                <Pressable onPress={() => toggleModal(null)} style={styles.btn_fermer}>
                    <Text style={styles.btn_tittle}>Fermer</Text>
                </Pressable>
            </Modal>
            }
        </ScrollView>
    );


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    back: {
        backgroundColor: '#fff'
    },
    btn_tittle: {
        color: "#7d060d",
    },
    btn_fermer: {
        borderWidth: 0.5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems:'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        margin: 8,
        backgroundColor: '#f8eae2',
    },
})