import React from "react";
import { Text, View } from "react-native";
import { getRoleIconAndText } from "@/utils/labels";

interface ProfileSectionProps {
  avatarUri: string;
  familyRole?: string | null;
  gender?: string | null;
}

export default function ProfileSection({
  avatarUri,
  familyRole,
  gender,
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
    </View>
  );
}