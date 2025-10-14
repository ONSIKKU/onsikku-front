
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function NotificationSummary() {
  return (
    <View className="bg-white w-full p-6 rounded-2xl shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="notifications-outline" size={24} color="#F97315" />
          <Text className="text-lg font-bold text-gray-800 ml-2">알림</Text>
          <View className="bg-red-500 rounded-full w-5 h-5 justify-center items-center ml-1">
            <Text className="text-white text-xs font-bold">2</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text className="text-sm text-orange-500">✓ 모두 읽음</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-sm text-gray-500 mt-2">총 5개의 알림이 있어요</Text>
    </View>
  );
}
