
import React from "react";
import { Text, View } from "react-native";

interface ActivityStatProps {
  value: string;
  label: string;
}

const ActivityStat = ({ value, label }: ActivityStatProps) => (
  <View className="bg-orange-50 rounded-lg p-4 w-[48%] items-center justify-center">
    <Text className="text-2xl font-bold text-orange-500">{value}</Text>
    <Text className="text-xs text-gray-600 mt-1">{label}</Text>
  </View>
);

interface ActivitySectionProps {
  stats: {
    totalAnswers: number;
    reactionsReceived: number;
    consecutiveDays: number;
    familyRank: number;
  };
}

export default function ActivitySection({ stats }: ActivitySectionProps) {
  return (
    <View className="bg-white w-full p-6 rounded-2xl shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-4">나의 활동</Text>
      <View className="flex-row flex-wrap justify-between gap-y-3">
        <ActivityStat value={String(stats.totalAnswers)} label="총 답변 수" />
        <ActivityStat
          value={String(stats.reactionsReceived)}
          label="받은 반응"
        />
        <ActivityStat value={`${stats.consecutiveDays}일`} label="연속 참여" />
        <ActivityStat value={`${stats.familyRank}위`} label="가족 내 순위" />
      </View>
    </View>
  );
}
