import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Button, TimePickerAndroid, Platform } from 'react-native';
import { BorderlessButton, RectButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import TimePicker from '../../components/TimePicker';

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

    const handleToggleTimePicker = (pickerTime: Date) => {
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
                                placeholder={{ label: 'Qual a matéria?', value: null }}
                                value={subject}
                                onValueChange={setSubject}
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
                                        placeholder={{ label: 'Qual o dia?', value: null }}
                                        value={week_day}
                                        onValueChange={setWeekDay}
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
                                    <Text>
                                        {timeAsString}
                                    </Text>
                                </TouchableWithoutFeedback>

                                <TimePicker 
                                    visible={showTimePicker}
                                    setVisible={setShowTimePicker}
                                    time={time}
                                    setTime={setTime}
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