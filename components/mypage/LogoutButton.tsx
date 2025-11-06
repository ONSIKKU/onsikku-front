
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface LogoutButtonProps {
  onPress?: () => void;
}

export default function LogoutButton({ onPress }: LogoutButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white w-full p-4 rounded-3xl shadow-sm flex-row items-center justify-center gap-2"
      activeOpacity={0.7}
    >
      <Ionicons name="log-out-outline" size={20} color="#F97315" />
      <Text className="text-base font-medium text-orange-500">로그아웃</Text>
    </TouchableOpacity>
  );
}
