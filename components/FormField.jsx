import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'

export default function FormField({ title, value, handleChangeText, otherStyles, placeholder, keyboardType, ...props }) {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base font-pmedium text-gray-100">{title}</Text>
            <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
                <TextInput
                    className="flex-1 text-white font-psemibold text-base"
                    value={value}
                    placeholder={placeholder}
                    onChangeText={handleChangeText}
                    placeholderTextColor="#7b7b8b"
                    secureTextEntry={title == 'Password' && !showPassword}
                />
                {title === 'Password' &&
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Image
                            source={!showPassword ? icons.eye : icons.eyeHide}
                            resizeMode="contain"
                            className="w-6 h-6"
                        />
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}