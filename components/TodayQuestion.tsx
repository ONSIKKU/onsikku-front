import { MessageCircle } from "lucide-react-native";
import { Text, View } from "react-native";
import GeneralButton from "./GeneralButton";
import { router } from "expo-router";

interface TodayQuestionProps {
  question: string;
  questionAssignmentId?: string;
  isUserAssignment?: boolean; // 현재 사용자에게 할당된 질문인지
}

export default function TodayQuestion({ question, questionAssignmentId, isUserAssignment = false }: TodayQuestionProps) {
  const handlePress = () => {
    if (questionAssignmentId && isUserAssignment) {
      router.push({
        pathname: "/reply",
        params: { 
          questionAssignmentId,
          question 
        },
      });
    } else {
      console.log("[TodayQuestion] questionAssignmentId가 없거나 사용자에게 할당되지 않은 질문입니다");
    }
  };

  // 현재 사용자에게 할당된 질문이고, 질문 내용이 있으면 활성화
  const isActive = isUserAssignment && !!question && !!questionAssignmentId && question !== "오늘 하루 어떠셨나요?\n위로받고 싶은 일이 있었나요?";

  return (
    <View className="bg-white w-full p-6 rounded-3xl shadow-sm">
      <View className="flex flex-row items-center gap-2 mb-4">
        <MessageCircle color="#FB923C" size={24} />
        <Text className="font-bold text-xl text-gray-800">오늘의 질문</Text>
      </View>

      <View className="bg-orange-50 p-5 rounded-2xl mb-5">
        <Text className="font-sans text-base text-gray-700 leading-6">{question}</Text>
      </View>
      <GeneralButton 
        text="나의 생각 들려주기" 
        isActive={isActive} 
        onPress={handlePress}
      />
    </View>
  );
}
