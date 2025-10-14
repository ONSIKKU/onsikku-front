
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function LogoutButton() {
  return (
    <View className="bg-white w-full p-4 rounded-2xl shadow-sm">
      <TouchableOpacity
        onPress={() => console.log("Logout")}
        className="flex-row items-center justify-center"
      >
        <Ionicons name="log-out-outline" size={20} color="#F97315" />
        <Text className="text-base text-orange-500 ml-2">로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}
