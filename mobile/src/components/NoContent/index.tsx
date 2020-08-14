import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

interface NoContentProps {
    text: string;
    textColor?: string;
}

const NoContent: React.FC<NoContentProps> = ({ text, textColor }) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        </View>
    );
}

export default NoContent;