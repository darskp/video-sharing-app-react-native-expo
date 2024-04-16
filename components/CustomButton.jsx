import { View, TouchableOpacity,Text } from 'react-native'
import React from 'react'

const CustomButton = ({ title, isLoading, handlePress, containerStyle, textStyle }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyle} ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
        >
        <Text className={`text-primary font-psemibold text-lg ${textStyle}`}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton