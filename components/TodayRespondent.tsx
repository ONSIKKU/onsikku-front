import { Member, QuestionAssignment } from "@/utils/api";
import { getRoleIconAndText } from "@/utils/labels";
import { Clock4, Star } from "lucide-react-native";
import { Text, View } from "react-native";
import RoleCard from "./RoleCard";

interface TodayRespondentProps {
  members: Member[];
  assignments: QuestionAssignment[];
  currentUserId: string | null;
}

export default function TodayRespondent({
  members,
  assignments,
  currentUserId,
}: TodayRespondentProps) {
  const pendingCount = assignments.filter((a) => a.state !== "ANSWERED").length;

  return (
    <View className="bg-white w-full p-6 rounded-3xl shadow-sm">
      <Text className="font-sans font-bold text-gray-500 mb-4 ml-1">
        오늘의 주인공
      </Text>
      <View className="flex-row justify-around items-start mb-4 gap-2 flex-wrap">
        {members.map((member) => {
          const assignment = assignments.find((a) => a.member.id === member.id);
          const isAnswered = assignment?.state === "ANSWERED";
          const isAssigned = !!assignment;
          const isMe = member.id === currentUserId;
          const { icon, text } = getRoleIconAndText(
            member.familyRole,
            member.gender
          );

          return (
            <View key={member.id} className="items-center w-[22%] mb-2">
              <RoleCard
                icon={icon}
                roleName={`${text}${isMe ? " (나)" : ""}`}
                isSelected={isAnswered}
                isPending={isAssigned && !isAnswered}
                isProtagonist={isAssigned}
              />
            </View>
          );
        })}
      </View>

    </View>
  );
}
