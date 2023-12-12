//CameraScreen.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Modal, ScrollView, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { WineCard } from './WineCard';
import { useFocusEffect } from '@react-navigation/native';
import CustomCodBarScanner from './CustomBarCodeScanner';
import Feedback from './Feedback';
import { wine_url, bucket_url } from '../config';


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [wineScanned, setWineScanned] = useState([]);
  const [barcodeData, setBarcodeData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(true)

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, [])
  );


  const handleBarCodeScanned = async ({ type, data }) => {
    console.log("handleBarCodeScanned " + data);
    setScanned(true);
    setBarcodeData(data);

    try {
      const response = await fetch(`${wine_url}/getWine/codebare?codebarre=${data}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(`Waiting json`)
      const wine = await response.json();
      if (!wine.length) {
        alert("Wine not exist yet");
        return;
      }
      console.log(wine);
      setWineScanned(wine[0]);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching wine data:', error);
    }


  };


  const closeModal = () => {
    setIsModalVisible(false);
    setScanned(false);
  };
  
  return (
    <View style={styles.container}>
      {isFocused ? <CustomCodBarScanner
        scanned={scanned}
        setScanned={setScanned}
        handleBarCodeScanned={handleBarCodeScanned}
      /> : null}
      {scanned && <Button title={'Tap to Scan Again'} onPress={closeModal} />}
      {wineScanned && (

        <Modal
          animationType="slide"
          transparent={false}
          visible={isModalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalContent}>
            <ScrollView>
              <WineCard                        
                key={wineScanned[0]}
                year={wineScanned[0]}
                percent={wineScanned[2]}
                advice={wineScanned[3]}
                appellation={wineScanned[4]}
                region={wineScanned[5]}
                type={wineScanned[6]}
                warning={wineScanned[7]}
                producer={wineScanned[9]}
                img_url={`${bucket_url}/${wineScanned[10]}`}
                cepage={wineScanned[11]}
              />
              <Feedback
                  currentWine={wineScanned}
              />
            </ScrollView>
            <Pressable onPress={() => closeModal()} style={styles.btn_fermer}>
                    <Text style={styles.btn_tittle}>Fermer</Text>
                </Pressable>
          </View>
        </Modal>)
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
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
});