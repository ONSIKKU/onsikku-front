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
    <View className="items-center justify-center py-6">
      <Text className="text-[100px]">{icon}</Text>
    </View>
  );
}