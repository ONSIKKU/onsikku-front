
import React from "react";
import { View, Text } from "react-native";
import SettingsItem, { SettingsItemProps } from "./SettingsItem";

const settings: Omit<SettingsItemProps, "onPress">[] = [
  {
    icon: "people-outline",
    title: "가족 관리",
    subtitle: "가족 구성원 초대 및 관리",
  },
  {
    icon: "notifications-outline",
    title: "알림 설정",
    subtitle: "질문 알림 시간 설정",
  },
  {
    icon: "ribbon-outline",
    title: "내 활동 기록",
    subtitle: "참여 통계 및 성취도",
  },
];

export default function SettingsSection() {
  return (
    <View className="bg-white w-full p-6 rounded-2xl shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-2">설정</Text>
      <View>
        {settings.map((item, index) => (
        <SettingsItem
          key={index}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          onPress={() => {
            // Navigate to item.title
          }}
        />
        ))}
      </View>
    </View>
  );
}
