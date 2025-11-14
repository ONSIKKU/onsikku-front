import { Clock4, Star } from "lucide-react-native";
import { Text, View } from "react-native";
import RoleCard from "./RoleCard";
import { QuestionMember } from "@/utils/api";
import { familyRoleToKo } from "@/utils/labels";

interface TodayRespondentProps {
  subject?: QuestionMember | null;
  pendingCount?: number;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "PARENT":
      return "👨🏻👩🏻";
    case "CHILD":
      return "👦🏻👧🏻";
    case "GRANDPARENT":
      return "👴🏻👵🏻";
    default:
      return "👤";
  }
};

export default function TodayRespondent({ subject, pendingCount = 0 }: TodayRespondentProps) {
  const roleName = subject ? familyRoleToKo(subject.familyRole) : "가족";
  const icon = subject ? getRoleIcon(subject.familyRole) : "👤";
  
  return (
    <View className="bg-white w-full p-4 gap-2 rounded-xl flex-1/2">
      <View className="flex flex-row items-center gap-2">
        <Star fill="#FB923C" color="#FB923C" size={24} />
        <Text className="font-bold text-xl">오늘의 주인공</Text>
      </View>

      <View className="flex flex-row items-center justify-center">
        <RoleCard 
          icon={icon} 
          roleName={roleName} 
          isSelected={true} 
        />
      </View>
      
      {pendingCount > 0 && (
        <View className="flex flex-row gap-2 justify-center items-center">
          <Clock4 size={20} color={"#FB923C"} />
          <Text className="text-onsikku-dark-orange font-bold">
            {pendingCount}명이 답변 대기중이에요
          </Text>
        </View>
      )}
    </View>
  );
}
