import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Button, TimePickerAndroid, Platform } from 'react-native';
import { BorderlessButton, RectButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import PickerSelect from '../../components/PickerSelect';

import api from '../../services/api';

import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import parseDateAsTimeString from '../../utils/parseDateAsTimeString';
import NoContent from '../../components/NoContent';

function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isFiltersVisibile, setIsFiltersVisible] = useState(false);

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [timeAsString, setTimeAsString] = useState('Qual o horário?');

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState(new Date());

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => teacher.id);

                setFavorites(favoritedTeachersIds);
            }
        });
    }

    useFocusEffect(() => {
        loadFavorites();
    })

    function handleToggleFiltersVisibile() {
        setIsFiltersVisible(!isFiltersVisibile);
    }

    async function handleFiltersSubmit() {
        loadFavorites();

        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time: timeAsString
            }
        });

        setIsFiltersVisible(false);
        setTeachers(response.data);
    }

    const onTimePickerConfirm = (pickerTime: Date) => {
        const date = pickerTime || new Date();
        const formattedStringTime = parseDateAsTimeString(date);

        setShowTimePicker(false);
        setTime(date);
        setTimeAsString(formattedStringTime);
    }

    useEffect(() => {
        const formattedStringTime = parseDateAsTimeString(time);

        setTimeAsString(formattedStringTime);
    }, [time]);

    return (
        <View style={styles.container}>
            <PageHeader
                title="Proffys disponíveis"
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisibile}>
                        <Feather name="filter" size={20} color="#FFF" />
                    </BorderlessButton>
                )}
            >
                { isFiltersVisibile && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <View style={styles.input}>
                            <PickerSelect 
                                placeholder="Qual a matéria?"
                                value={subject}
                                onChange={setSubject}
                                items={[
                                    { label: 'Artes', value: 'Artes' },
                                    { label: 'Biologia', value: 'Biologia' },
                                    { label: 'Ciências', value: 'Ciências' },
                                    { label: 'Educação física', value: 'Educação física' },
                                    { label: 'Geografia', value: 'Geografia' },
                                    { label: 'História', value: 'História' },
                                    { label: 'Matemática', value: 'Matemática' },
                                    { label: 'Português', value: 'Português' },
                                    { label: 'Química', value: 'Química' }
                                ]}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <View style={styles.input}>
                                    <PickerSelect 
                                        placeholder="Qual o dia?"
                                        value={week_day}
                                        onChange={setWeekDay}
                                        items={[
                                            { label: 'Domingo', value: '0' },
                                            { label: 'Segunda-feira', value: '1' },
                                            { label: 'Terça-feira', value: '2' },
                                            { label: 'Quarta-feira', value: '3' },
                                            { label: 'Quinta-feira', value: '4' },
                                            { label: 'Sexta-feira', value: '5' },
                                            { label: 'Sábado', value: '6' }
                                        ]}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TouchableWithoutFeedback 
                                    style={styles.input} 
                                    onPress={() => setShowTimePicker(true)}
                                >
                                    <Text style={styles.inputTimeText}>
                                        {timeAsString}
                                    </Text>
                                </TouchableWithoutFeedback>

                                <DateTimePickerModal
                                    isVisible={showTimePicker}
                                    is24Hour={true}
                                    mode="time"
                                    onConfirm={onTimePickerConfirm}
                                    onCancel={() => setShowTimePicker(false)}    
                                />
                    
                            </View>
                        </View>

                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            { teachers.length ? (
                <ScrollView
                    style={styles.teacherList}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 16
                    }}
                >
                    { teachers.map((teacher: Teacher) => (
                        <TeacherItem
                            key={teacher.id}
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    ))}
                </ScrollView>
            ) : (
                <NoContent 
                    text={"Ops! Não temos nada aqui... :(\nTente realizar uma nova filtragem"}
                    textColor="#8257E5"
                />
            ) }
        </View>
    );
}

export default TeacherList;