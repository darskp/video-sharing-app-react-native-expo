import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from 'react-native';

export default function Page() {
  return (
    <View className="flex-1 items-center justify-center bg-red-800">
      <Text className="text-3xl font-pblack">Hi1</Text>
      {/* <StatusBar style="auto"/> */}
      <Link href="/home" className="text-white">Go to Profile</Link>
    </View>
  );
}

