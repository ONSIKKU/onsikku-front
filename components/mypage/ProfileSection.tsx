
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { getRoleIconAndText } from "@/utils/labels";

interface ProfileSectionProps {
  name: string;
  email: string;
  familyName: string;
  joinDate: string;
  avatarUri: string;
  familyRole?: string | null;
  gender?: string | null;
  onEditPress?: () => void;
}

export default function ProfileSection({
  name,
  email,
  familyName,
  joinDate,
  avatarUri,
  familyRole,
  gender,
  onEditPress,
}: ProfileSectionProps) {
  const { icon } = getRoleIconAndText(familyRole, gender);
  
  return (
    <View className="bg-white w-full rounded-3xl shadow-sm overflow-hidden">
      {/* 헤더 */}
      <View className="bg-onsikku-main-orange h-36 relative">
        <View className="absolute bottom-0 left-0 right-0 items-center pb-4">
          <View className="relative">
            <View className="w-24 h-24 rounded-full border-4 border-white bg-orange-100 items-center justify-center shadow-sm overflow-visible">
              <View className="items-center justify-center" style={{ paddingTop: 4 }}>
                <Text className="text-5xl">{icon}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      {/* 프로필 정보 */}
      <View className="pt-14 px-6 pb-6 items-center">
        <Text className="text-2xl font-bold text-gray-800">{name}</Text>
        {familyName ? (
          <View className="flex-row items-center mt-2 px-3 py-1 bg-orange-50 rounded-full">
            <Ionicons name="people" size={14} color="#FB923C" />
            <Text className="text-sm text-orange-600 ml-1 font-medium">{familyName}</Text>
          </View>
        ) : null}
        {joinDate ? (
          <Text className="text-xs text-gray-400 mt-3">
            {joinDate}부터 함께하고 있어요 💕
          </Text>
        ) : null}
      </View>
    </View>
  );
}
