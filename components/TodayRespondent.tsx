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
      <View className="flex flex-row items-center gap-2 mb-4">
        <Star color="#FB923C" size={24} />
        <Text className="font-bold text-xl text-gray-800">오늘의 주인공</Text>
      </View>

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
              />
            </View>
          );
        })}
      </View>

      {pendingCount > 0 ? (
        <View className="flex flex-row gap-2 justify-center items-center bg-orange-50 py-3 px-4 rounded-xl">
          <Clock4 size={18} color={"#FB923C"} />
          <Text className="text-onsikku-dark-orange font-medium text-sm">
            답변을 기다리고 있어요
          </Text>
        </View>
      ) : (
        <View className="flex flex-row gap-2 justify-center items-center bg-orange-50 py-3 px-4 rounded-xl">
          <Text className="text-onsikku-dark-orange font-medium text-sm">
            답변이 완료됐어요!
          </Text>
        </View>
      )}
    </View>
  );
}
