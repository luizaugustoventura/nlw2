import React, { Dispatch, SetStateAction } from 'react';
import RNPickerSelect from 'react-native-picker-select';

interface PickerSelectPropos {
    placeholder: string;
    value: any;
    onChange: Dispatch<SetStateAction<any>>;
    items: {
        label: string;
        value: any;
    }[];
}

const PickerSelect: React.FC<PickerSelectPropos> = ({ placeholder, value, onChange, items }) => {
    return (
        <RNPickerSelect
            style={{ 
                placeholder: {
                    color: '#C1BCCC'
                }
            }}
            placeholder={{ label: placeholder, value: null, color: '#C1BCCC' }}
            value={value}
            onValueChange={onChange}
            items={
                items.map((item, itemIndex) => (
                    { key: itemIndex, ...item, color: '#000' }
                ))
            }
            // items={[
            //     { label: 'Artes', value: 'Artes', color: '#000' },
            //     { label: 'Biologia', value: 'Biologia', color: '#000' },
            //     { label: 'Ciências', value: 'Ciências', color: '#000' },
            //     { label: 'Educação física', value: 'Educação física', color: '#000' },
            //     { label: 'Geografia', value: 'Geografia', color: '#000' },
            //     { label: 'História', value: 'História', color: '#000' },
            //     { label: 'Matemática', value: 'Matemática', color: '#000' },
            //     { label: 'Português', value: 'Português', color: '#000' },
            //     { label: 'Química', value: 'Química', color: '#000' }
            // ]}
        />
    );
}

export default PickerSelect;