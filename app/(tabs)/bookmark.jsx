import { View, Text, SafeAreaView, ScrollView, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchInput from '../../components/searchInput'
import VideoCard from '../../components/VideoCard'
import { getAllPost } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import EmptyState from '../../components/EmptyState'
import { useGlobalContext } from '../../context/GlobalProvider'

const Bookmark = () => {
  const { data: posts, isLoading: postsLoading, refetch } = useAppwrite(getAllPost);
  const { isLoggedIn, setIsLoggedIn, user, setUser, } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    if (user?.liked && posts) {
      const filteredPosts = posts.filter(post => user?.liked?.includes(post?.$id));
      setFilteredPosts(filteredPosts);
    }
  }, [user.liked, posts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const fetchData = async () => {
    await refetch();
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="my-6">
        <Text className="text-2xl px-4 text-white font-psemibold mt-10 ">
          Saved Videos
        </Text>
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <VideoCard
              video={item}
            />
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Saved Videos"
              subtitle="You haven't saved any videos yet."
            />
          )}
          refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Bookmark;