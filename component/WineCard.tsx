import React from 'react';
import { View, Text, Image, StyleSheet, Button, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface WineCardProps {
  producer: any;
  img_url: any;
  type: any;
  appellation: any;
  region: any;
  year: any;
  percent: any;
  advice: any;
  warning: any;
  cepage: any;
  onPress?: () => void;
}

export const WineCard: React.FC<WineCardProps> = ({
  producer,
  img_url,
  type,
  appellation,
  region,
  year,
  percent,
  advice,
  warning,
  cepage,
  onPress,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleError = () => {
    console.log("Error on image")
    setImageError(true);
  };

  return (
    <View style={styles.cardContainer}>
      <Image
        source={imageError ? require('../assets/splash.png') : { uri: img_url }}
        style={styles.image}
        onError={handleError}
      />

      <View style={styles.infoContainer}>

        <Text style={styles.producer}>{producer}, {year}</Text>
        <Text><AntDesign name="book" size={16} color="black" />{appellation}</Text>
        <Text><MaterialCommunityIcons name="glass-wine" size={16} color="black" /> {type}</Text>
        <Text><AntDesign name="infocirlceo" size={16} color="black" /> {percent}%</Text>
        <Text><MaterialCommunityIcons name="fruit-grapes-outline" size={16} color="black" /> {cepage}</Text>
        {advice && <Text><MaterialCommunityIcons name="notebook-check-outline" size={16} color="black" /> {advice}</Text>}
        {warning && <Text><AntDesign name="warning" size={16} color="black" /> {warning} </Text>}
        <Text><AntDesign name="enviromento" size={16} color="black" /> {region}</Text>
      </View>
      {onPress &&
        <Pressable onPress={onPress} style={styles.btn}>
          <Text style={styles.btn_tittle}>Plus d'informations</Text>
        </Pressable>
      }

    </View>
  );
};

const styles = StyleSheet.create({

  cardContainer: {
    borderRadius: 8,
    margin: 8,
    overflow: 'hidden',
    backgroundColor: '#f8eae2',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginVertical: 10,
  },
  image: {
    borderRadius: 8,
    width: '100%',
    height: 300,
  },
  infoContainer: {
    margin: 8,
    backgroundColor: '#f8eae2',
  },
  producer: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: "#7d060d",
  },
});


export default WineCard;