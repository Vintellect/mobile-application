import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, TextInput, Modal } from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../auth/authContext';
import { feedback_url } from '../config';

interface FeedbackProps {
    currentWine: any;
}

const Feedback: React.FC<FeedbackProps> = ({
    currentWine,
}) => {
    const [starCount, setStarCount] = useState(0);
    const [textFeedback, onChangeText] = React.useState('');
    const [comments, setComment] = useState([]);
    const [isUpdateVisible, setUpdateVisible] = useState(false);
    const [dropdownStates, setDropdownStates] = useState(comments.map(() => false));
    const [starCountUpdate, setStarCountUpdate] = useState(0);
    const [textFeedbackUpdate, onChangeTextUpdate] = useState('');
    const [userFeedbackUpdate, onChangeUserUpdate] = useState(0);
    const [wineFeedbackUpdate, onChangeWineUpdate] = useState(0);
    const [uid, setUid] = useState('');
    const isAdmin = useAuth();

    useEffect(() => {
        loadComment(currentWine[1]);
        const fetchData = async () => {
            try {
                const data = await AsyncStorage.getItem('uid');
                setUid(data);
            } catch (error) {
                console.error('Erreur lors de la récupération de uid depuis AsyncStorage:', error);
            }
        };
    
        fetchData();
    }, []);

    const loadComment = async (codeWine) => {
        if (codeWine != "None") {
            fetch( feedback_url + '/get_feedback/' + codeWine, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {                   
                    return response.json();
                })
                .then((result) => {
                    setComment(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setComment([]);
        }
    }


    const addFeedback = async () => {
        if (starCount > 0 && textFeedback != "" && currentWine[1] != "None") {
            const uid = await AsyncStorage.getItem('uid');
            
            const feedbackData = {
                user_id: uid,
                wine_id: currentWine[1],
                note: starCount,
                comment: textFeedback,
            }
            
            
            fetch(feedback_url + '/add_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
            })
                .then((response) => {
                    if (response.status === 409) {
                        return Promise.reject('Conflict - You already add feedback for this wine.');
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    alert(data.success);
                    loadComment(currentWine[1]);

                })
                .catch(error => {
                    alert(error);
                });
            onChangeText('');
            setStarCount(0);
        }
    }

    const update_feedback = async () => {
        const url = feedback_url + '/update_feedback/' + userFeedbackUpdate + '/' + wineFeedbackUpdate + '?token=' + uid;
        
        
        const feedbackData = {
          note: starCountUpdate,
          comment: textFeedbackUpdate,
        }
        
    
        fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData),
        })
            .then((response) => {
                if (response.status === 403) {
                    return Promise.reject('Forbidden: User does not have permission to update this feedback');
                } else {
                    return response.json();
                }
            })
            .then((result) => {
                alert(result.success);
                loadComment(currentWine[1]);
            })
            .catch((err) => {
                alert(err);
                return [];
            });
        setUpdateVisible(false);
        setDropdownStates(dropdownStates.map(() => false));
    }
      
    const delete_feedback = async (user_id, wine_id) => {
        const token = await AsyncStorage.getItem('token');
        const uid = await AsyncStorage.getItem('uid');
        console.log(uid);
        
        const url = feedback_url + '/delete_feedback/' + user_id + '/' + wine_id + '?uid=' + uid;
        console.log(token);
        
        fetch(url, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }, 
        })
            .then((response) => {
                if (response.status === 403) {
                    return Promise.reject('Forbidden: User does not have permission to update this feedback');
                } else {
                    return response.json();
                }
            })
            .then((result) => {
                alert(result.success);
                loadComment(currentWine[1]);
            })
            .catch((err) => {
                alert(err);
                return [];
            });
        setDropdownStates(dropdownStates.map(() => false));
    }

    const openUpdate = (user_id, wine_id, star, comment) => {        
        onChangeUserUpdate(user_id);
        onChangeWineUpdate(wine_id);
        setStarCountUpdate(star);
        onChangeTextUpdate(comment);
        setUpdateVisible(true);
    }

    const moyenneNotes = comments.length > 0
    ? (comments.reduce((acc, comment) => acc + comment[2], 0) / comments.length).toFixed(2)
    : 0;
    const test = (t) => {
        console.log(t);
        console.log(uid);
        console.log('test: ' + t === uid);        
    }

    return (
        <View style={{paddingBottom: 75, padding: 16}}>
            <StarRating
                disabled={false}
                maxStars={5}
                rating={starCount}
                selectedStar={(rating) => setStarCount(rating)}
            />
            <TextInput
                onChangeText={onChangeText}
                value={textFeedback}
                placeholder="Ecrivez votre avis sur ce vin"
                keyboardType="default"
                style={styles.text_input}
            />
            <Pressable onPress={() => addFeedback()} style={styles.btn_avis}>
                <Text>Ajouter un avis</Text>
            </Pressable>
            <Text style={{paddingBottom: 5}}>Moyenne des notes : {moyenneNotes}</Text>
            <View style={styles.cardContainer}>
                {comments.map((comment, index) => (
                    <View
                        key={index}
                    >
                        <Pressable
                            onLongPress={() => {
                            const newStates = [...dropdownStates];
                            newStates[index] = true;
                            setDropdownStates(newStates);
                            }}
                            onPress={() => {
                            const newStates = [...dropdownStates];
                            newStates[index] = false;
                            setDropdownStates(newStates);
                            }}
                        >
                            <View style={[styles.feedbackContainer, uid === comment[0] ? styles.ownComment: null]}>
                                <Text>{comment[3]}</Text>
                                <Text>{comment[2]}/5</Text>
                            </View>
                        </Pressable> 
                        {dropdownStates[index] && (
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: "space-around"}}>
                                {(comment[0] === uid) && (
                                    <Pressable onPress={() => openUpdate(comment[0], comment[1], comment[2], comment[3])} style={{padding: 5}}>
                                        <Text>Modifier</Text>
                                    </Pressable>
                                )}
                                {(isAdmin || (comment[0] === uid)) && 
                                    <Pressable onPress={() => delete_feedback(comment[0], comment[1])} style={{padding: 5}}>
                                        <Text>Supprimer</Text>
                                    </Pressable>
                                }
                            </View>
                        )}
                    </View>
                ))}
            </View>
            <Modal
                visible={isUpdateVisible}
            >
                <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={starCountUpdate}
                    selectedStar={(rating) => setStarCountUpdate(rating)}
                />
                <TextInput
                    onChangeText={onChangeTextUpdate}
                    value={textFeedbackUpdate}
                    placeholder="Ecrivez votre avis sur ce vin"
                    keyboardType="default"
                    style={styles.text_input}
                />
                <Pressable onPress={() => update_feedback()} style={styles.btn_avis}>
                    <Text>Modifier l'avis</Text>
                </Pressable>
                <Pressable onPress={() => setUpdateVisible(false)} style={styles.btn_avis}>
                    <Text>Fermer</Text>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    btn_avis: {
        padding: 10,
        marginBottom: 25,
        backgroundColor: '#f8eae2',
        borderWidth: 1,
        borderRadius: 5,
    },
    text_input: {
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
    },
    cardContainer: {
        backgroundColor: '#f8eae2',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        borderRadius: 5,
    },
    feedbackContainer: {
        padding: 8,
        overflow: 'hidden',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
    },
    ownComment: {
        backgroundColor: '#e8d2c9',
      },
})


export default Feedback;