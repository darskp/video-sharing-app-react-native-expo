import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import { ResizeMode, Video } from 'expo-av';
import { useGlobalContext } from '../context/GlobalProvider';
import { getAllPost, updateLiked } from '../lib/appwrite';

const VideoCard = ({ video: { title, thumbnail, video, $id, creator: { username, avatar, liked } } }) => {

    const [play, setplay] = useState(false);
    const { user } = useGlobalContext();

    const [isLiked, setIsLiked] = useState(user?.liked?.includes($id) || false );

    useEffect(() => {
        if (user?.liked) {
            setIsLiked(user?.liked?.includes($id));
        }
    }, [user.liked, $id]);

    const handleSaved = async () => {
        await updateLiked($id, user);
        setIsLiked(!isLiked);
    };

    return (
        <View className="flex-col items-center px-4 mb-14">
            <View className="flex-row gap-3 items-start">

                <View className="justify-center items-center flex-row flex-1">

                    <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
                        <Image source={{ uri: avatar }}
                            className="w-full h-full rounded-lg"
                            resizeMode='cover'
                        />
                    </View>

                    <View className="justify-center flex-1 ml-3 gap-y-1">
                        <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
                            {title}
                        </Text>
                        <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
                            {username}
                        </Text>
                    </View>

                </View>
                <View className="pt-2">
                    <TouchableOpacity onPress={handleSaved}>
                        {isLiked ?
                            <Image
                                source={icons.filledheart}
                                resizeMode='contain'
                                className="w-5 h-5"
                            /> :
                            <Image
                                source={icons.outlineheart}
                                resizeMode='contain'
                                className="w-5 h-5"
                            />
                        }
                    </TouchableOpacity>
                </View>
                <View className="pt-2">
                    <Image
                        source={icons.menu}
                        resizeMode='contain'
                        className="w-5 h-5"
                    />

                </View>


            </View>

            {
                play ? (
                    <Video
                        source={{ uri: video }}
                        className="w-full h-60 rounded-xl"
                        resizeMode={ResizeMode.CONTAIN}
                        useNativeControls
                        shouldPlay
                        onPlaybackStatusUpdate={(status) => {
                            if (status.didJustFinish) {
                                setplay(false);
                            }
                        }}
                    />
                ) :
                    (
                        <TouchableOpacity
                            className="w-full h-60 rounded-xl mt-4 relative justify-center items-center"
                            activeOpacity={0.7}
                            onPress={() => setplay(true)}
                        >
                            <Image
                                source={{ uri: thumbnail }}
                                className="w-full h-full rounded-xl mt-3"
                                resizeMode='cover'
                            />
                            <Image
                                source={icons.play}
                                className="w-12 h-12 absolute"
                                resizeMode='contain'
                            />

                        </TouchableOpacity>
                    )

            }
        </View>
    )
}

export default VideoCard