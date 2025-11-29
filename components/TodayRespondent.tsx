import { QuestionMember } from "@/utils/api";
import { getRoleIconAndText } from "@/utils/labels";
import { Clock4, Star } from "lucide-react-native";
import { Text, View } from "react-native";
import RoleCard from "./RoleCard";

interface TodayRespondentProps {
  subject?: QuestionMember | null;
  gender?: string | null;
  pendingCount?: number;
}

export default function TodayRespondent({
  subject,
  gender,
  pendingCount = 0,
}: TodayRespondentProps) {
  const { icon, text } = getRoleIconAndText(
    subject?.familyRole,
    gender || subject?.gender
  );
  const roleName = text || "가족";

  return (
    <View className="bg-white w-full p-6 rounded-3xl shadow-sm">
      <View className="flex flex-row items-center gap-2 mb-4">
        <Star color="#FB923C" size={24} />
        <Text className="font-bold text-xl text-gray-800">오늘의 주인공</Text>
      </View>

      <View className="flex flex-row items-center justify-center mb-4">
        <RoleCard icon={icon} roleName={roleName} isSelected={true} />
      </View>

      {pendingCount > 0 && (
        <View className="flex flex-row gap-2 justify-center items-center bg-orange-50 py-3 px-4 rounded-xl">
          <Clock4 size={18} color={"#FB923C"} />
          <Text className="text-onsikku-dark-orange font-medium text-sm">
            {pendingCount}명이 답변 대기중이에요
          </Text>
        </View>
      )}
    </View>
  );
}
