import { MessageCircle } from "lucide-react-native";
import { Text, View } from "react-native";
import GeneralButton from "./GeneralButton";
import { router } from "expo-router";

interface TodayQuestionProps {
  question: string;
  questionAssignmentId?: string;
}

export default function TodayQuestion({ question, questionAssignmentId }: TodayQuestionProps) {
  const handlePress = () => {
    if (questionAssignmentId) {
      router.push({
        pathname: "/reply",
        params: { 
          questionAssignmentId,
          question 
        },
      });
    } else {
      console.log("[TodayQuestion] questionAssignmentId가 없어서 답변 작성 불가");
    }
  };

  // 질문이 있으면 활성화 (questionAssignmentId가 없어도 질문 내용이 있으면 활성화)
  const isActive = !!question && question !== "오늘 하루 어떠셨나요?\n위로받고 싶은 일이 있었나요?";

  return (
    <View className="bg-white w-full p-4 gap-2 rounded-xl flex-1">
      <View className="flex flex-row items-center gap-2">
        <MessageCircle color="#FB923C" size={24} />
        <Text className="font-bold text-xl">오늘의 질문</Text>
      </View>

      <View className="flex flex-row items-center bg-onsikku-main-orange flex-1 rounded-2xl px-2">
        <Text className="font-sans text-lg">{question}</Text>
      </View>
      <GeneralButton 
        text="나의 생각 들려주기" 
        isActive={isActive} 
        onPress={handlePress}
      />
    </View>
  );
}
