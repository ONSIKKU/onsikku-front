
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function DateSelector() {
  return (
    <View className="bg-white w-full p-6 rounded-2xl shadow-sm">
      <View className="flex-row items-center mb-3">
        <Ionicons name="time-outline" size={20} color="#F97315" />
        <Text className="text-base font-bold text-gray-800 ml-2">
          기간 선택
        </Text>
      </View>
      <TouchableOpacity className="border border-gray-300 rounded-lg p-3 flex-row justify-between items-center">
        <Text className="text-base text-gray-700">2024년 7월</Text>
        <Ionicons name="chevron-down-outline" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
}
