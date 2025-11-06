
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { User } from "lucide-react-native";

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
  const hasValidImage = avatarUri && avatarUri.startsWith("http");
  
  return (
    <View className="bg-white w-full rounded-3xl shadow-sm overflow-hidden">
      {/* 헤더 */}
      <View className="bg-onsikku-main-orange h-32 relative">
        <View className="absolute bottom-0 left-0 right-0 items-center pb-4">
          <View className="relative">
            {hasValidImage ? (
              <Image
                source={{ uri: avatarUri }}
                className="w-24 h-24 rounded-full border-4 border-white"
                onError={() => {
                  // 이미지 로드 실패 시 기본 아바타로 fallback
                }}
              />
            ) : (
              <View className="w-24 h-24 rounded-full border-4 border-white bg-orange-100 items-center justify-center shadow-sm">
                <User size={48} color="#FB923C" />
              </View>
            )}
            <TouchableOpacity
              onPress={onEditPress}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-orange-500 items-center justify-center border-2 border-white"
            >
              <Ionicons name="camera" size={14} color="white" />
            </TouchableOpacity>
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
