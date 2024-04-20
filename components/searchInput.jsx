import { View, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'

export default function SearchInput({ title, value, handleChangeText, otherStyles, placeholder, keyboardType, ...props }) {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <View className=" space-x-4 border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
            <TextInput
                className="text-base mt-0.5 flex-1 text-white font-pregular"
                value={value}
                placeholder="Search for a video topic"
                onChangeText={handleChangeText}
                placeholderTextColor="#7b7b8b"
                secureTextEntry={title == 'Password' && !showPassword}
            />
            <TouchableOpacity>
                <Image
                    source={icons.search}
                    resizeMode='contain'
                    className='w-5 h-5'
                />
            </TouchableOpacity>
        </View>
    )
}