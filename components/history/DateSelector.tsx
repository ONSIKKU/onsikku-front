import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface DateSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function DateSelector({
  selectedYear,
  selectedMonth,
  onPrevMonth,
  onNextMonth,
}: DateSelectorProps) {
  return (
    <View className="bg-white w-full p-6 rounded-2xl shadow-sm">
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={onPrevMonth}
          className="p-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#F97315" />
        </Pressable>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={20} color="#F97315" />
          <Text className="text-base font-bold text-gray-800 ml-2">
            {selectedYear}년 {selectedMonth}월
          </Text>
        </View>
        <Pressable
          onPress={onNextMonth}
          className="p-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Ionicons name="chevron-forward-outline" size={24} color="#F97315" />
        </Pressable>
      </View>
    </View>
  );
}
