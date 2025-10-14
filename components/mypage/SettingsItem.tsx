
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type SettingsItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
};

export default function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4"
    >
      <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center mr-4">
        <Ionicons name={icon} size={24} color="#F97315" />
      </View>
      <View className="flex-1">
        <Text className="text-base text-gray-800">{title}</Text>
        <Text className="text-sm text-gray-500">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="gray" />
    </TouchableOpacity>
  );
}
