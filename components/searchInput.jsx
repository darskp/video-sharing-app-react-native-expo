import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { router, usePathname } from 'expo-router'

export default function SearchInput({ initialQuery, placeholder }) {
    const pathName = usePathname();
    const [query, setquery] = useState(initialQuery || '')

    return (
        <View className=" space-x-4 border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
            <TextInput
                className="text-base mt-0.5 flex-1 text-white font-pregular"
                value={query}
                placeholder={placeholder}
                onChangeText={(e) => setquery(e)}
                placeholderTextColor="#CDCDe0"
            />
            <TouchableOpacity
                onPress={() => {
                    if (!query) {
                        return Alert.alert('Missing Query', "Please input something to search results across database")
                    }
                    if (pathName.startsWith('/search'))
                        router.setParams({ query })
                    else
                        router.push(`/search/${query}`)
                }}
            >
                <Image
                    source={icons.search}
                    resizeMode='contain'
                    className='w-5 h-5'
                />
            </TouchableOpacity>
        </View>
    )
}