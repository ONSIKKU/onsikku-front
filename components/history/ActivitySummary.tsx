
import React from "react";
import { Text, View } from "react-native";

const StatCard = ({ value, label }: { value: number; label: string }) => (
  <View className="bg-orange-50 rounded-lg p-4 flex-1 items-center justify-center">
    <Text className="text-2xl font-bold text-orange-500">{value}</Text>
    <Text className="text-xs text-gray-600 mt-1">{label}</Text>
  </View>
);

export default function ActivitySummary() {
  return (
    <View className="bg-white w-full p-6 rounded-2xl shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-4">이번 달 활동</Text>
      <View className="flex-row justify-between gap-3">
        <StatCard value={4} label="총 질문" />
        <StatCard value={3} label="답변 완료" />
        <StatCard value={20} label="총 반응" />
      </View>
    </View>
  );
}
