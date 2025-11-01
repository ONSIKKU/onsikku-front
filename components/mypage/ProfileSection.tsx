
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProfileSectionProps {
  name: string;
  email: string;
  familyName: string;
  joinDate: string;
  avatarUri: string;
  onEditPress?: () => void;
}

export default function ProfileSection({
  name,
  email,
  familyName,
  joinDate,
  avatarUri,
  onEditPress,
}: ProfileSectionProps) {
  return (
    <View className="bg-white w-full p-6 rounded-2xl shadow-sm">
      <View className="flex-row items-center">
        <Image
          source={{ uri: avatarUri }}
          className="w-16 h-16 rounded-full mr-4"
        />
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800">{name}</Text>
          <Text className="text-sm text-gray-500">{email}</Text>
          <Text className="text-sm text-orange-500 mt-1">{familyName}</Text>
        </View>
        <TouchableOpacity onPress={onEditPress}>
          <Ionicons name="create-outline" size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <Text className="text-xs text-gray-400 mt-4 text-center">
        {joinDate}부터 함께하고 있어요 💕
      </Text>
    </View>
  );
}
