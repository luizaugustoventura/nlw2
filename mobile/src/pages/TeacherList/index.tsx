import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Button, TimePickerAndroid, Platform } from 'react-native';
import { BorderlessButton, RectButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import api from '../../services/api';

import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import parseDateAsTimeString from '../../utils/parseDateAsTimeString';

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
                            <RNPickerSelect
                                style={{ 
                                   placeholder: {
                                       color: '#C1BCCC'
                                   }
                                 }}
                                placeholder={{ label: 'Qual a matéria?', value: null, color: '#C1BCCC' }}
                                value={subject}
                                onValueChange={setSubject}
                                items={[
                                    { label: 'Artes', value: 'Artes', color: '#000' },
                                    { label: 'Biologia', value: 'Biologia', color: '#000' },
                                    { label: 'Ciências', value: 'Ciências', color: '#000' },
                                    { label: 'Educação física', value: 'Educação física', color: '#000' },
                                    { label: 'Geografia', value: 'Geografia', color: '#000' },
                                    { label: 'História', value: 'História', color: '#000' },
                                    { label: 'Matemática', value: 'Matemática', color: '#000' },
                                    { label: 'Português', value: 'Português', color: '#000' },
                                    { label: 'Química', value: 'Química', color: '#000' }
                                ]}
                            />
                        </View>
                        {/* <TextInput
                            style={styles.input}
                            value={subject}
                            onChangeText={setSubject}
                            placeholder="Qual a matéria?"
                            placeholderTextColor="#C1BCCC"
                        /> */}

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <View style={styles.input}>
                                    <RNPickerSelect
                                        style={{ 
                                            placeholder: {
                                                color: '#C1BCCC'
                                            }
                                        }}
                                        placeholder={{ label: 'Qual o dia?', value: null, color: '#C1BCCC' }}
                                        value={week_day}
                                        onValueChange={setWeekDay}
                                        items={[
                                            { label: 'Domingo', value: '0', color: '#000' },
                                            { label: 'Segunda-feira', value: '1', color: '#000' },
                                            { label: 'Terça-feira', value: '2', color: '#000' },
                                            { label: 'Quarta-feira', value: '3', color: '#000' },
                                            { label: 'Quinta-feira', value: '4', color: '#000' },
                                            { label: 'Sexta-feira', value: '5', color: '#000' },
                                            { label: 'Sábado', value: '6', color: '#000' }
                                        ]}
                                    />
                                </View>
                                {/* <TextInput
                                    style={styles.input}
                                    value={week_day}
                                    onChangeText={setWeekDay}
                                    placeholder="Qual o dia?"
                                    placeholderTextColor="#C1BCCC"
                                /> */}
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
                        
                                {/* <TextInput
                                    style={styles.input}
                                    value={time}
                                    onChangeText={setTime}
                                    placeholder="Qual horário?"
                                    placeholderTextColor="#C1BCCC"
                                /> */}
                            </View>
                        </View>

                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

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
        </View>
    );
}

export default TeacherList;