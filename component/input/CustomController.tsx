//CustomController.tsx
import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { Controller } from 'react-hook-form';

export function CustomController({ title, control, name, onFocusedChange, onChangeTextCustom, customStyle, ...props }) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
        if (onFocusedChange) {
            onFocusedChange(true);
        }
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onFocusedChange) {
            onFocusedChange(false);
        }
        props.onBlur && props.onBlur(e);
    };


    return (
        <View>
            {title ? <Text>{title}</Text> : null }
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={customStyle ? customStyle : [styles.input]}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChangeText={onChange}
                        value={value}
                        onContentSizeChange={onChangeTextCustom}
                        {...props}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 4,
        flex: 1,
    },
});
