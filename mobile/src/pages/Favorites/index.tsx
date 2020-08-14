import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import NoContent from '../../components/NoContent';

import styles from './styles';

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                
                setFavorites(favoritedTeachers);
            }
        });
    }

    useFocusEffect(() =>{
        loadFavorites();
    });
    
    return (
        <View style={styles.container}>
            <PageHeader title="Meus proffys favoritos" />

            { favorites.length ? (
                <ScrollView
                    style={styles.teacherList}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 16
                    }}
                >
                    { favorites.map((teacher: Teacher) => (
                        <TeacherItem key={teacher.id} teacher={teacher} favorited />
                    ))}
                </ScrollView> 
            ) : (
                <NoContent 
                    text="Ops! Não temos nada aqui... :("
                    textColor="#8257E5"
                />
            ) }
        </View>
    );
}

export default Favorites;