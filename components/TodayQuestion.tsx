import { MessageCircle, ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import GeneralButton from "./GeneralButton";
import { router } from "expo-router";

interface TodayQuestionProps {
  question: string;
  questionAssignmentId?: string;
  questionInstanceId?: string; // 질문 인스턴스 ID (답변 상세 페이지로 이동 시 필요)
  isUserAssignment?: boolean; // 현재 사용자에게 할당된 질문인지
  isAnswered?: boolean; // 답변 완료 여부
}

export default function TodayQuestion({ 
  question, 
  questionAssignmentId, 
  questionInstanceId,
  isUserAssignment = false, 
  isAnswered = false 
}: TodayQuestionProps) {
  const handlePress = () => {
    if (questionAssignmentId && isUserAssignment && !isAnswered) {
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

  const handleViewAnswer = () => {
    console.log("[TodayQuestion] 내 답변 바로가기 클릭", { questionInstanceId, question });
    if (questionInstanceId) {
      router.push({
        pathname: "/reply-detail",
        params: {
          questionInstanceId,
          question,
        },
      });
    } else {
      console.warn("[TodayQuestion] questionInstanceId가 없습니다.");
    }
  };

  // 현재 사용자에게 할당된 질문이고, 질문 내용이 있고, 아직 답변하지 않았으면 활성화
  const isActive = isUserAssignment && !!question && !!questionAssignmentId && !isAnswered && question !== "오늘 하루 어떠셨나요?\n위로받고 싶은 일이 있었나요?";

  return (
    <View className="bg-white w-full p-6 rounded-3xl shadow-sm">
      <View className="flex flex-row items-center gap-2 mb-4">
        <MessageCircle color="#FB923C" size={24} />
        <Text className="font-bold text-xl text-gray-800">오늘의 질문</Text>
      </View>

      <View className="bg-orange-50 p-5 rounded-2xl mb-5">
        <Text className="font-sans text-base text-gray-700 leading-6">{question}</Text>
      </View>

      {isAnswered ? (
        <>
          <View className="bg-gray-100 p-5 rounded-2xl mb-4">
            <Text className="text-center text-base text-gray-700 font-medium">
              오늘 답변을 완료했어요! 🎉
            </Text>
          </View>
          <View className="flex-row items-center justify-center gap-2 mb-2">
            <Text className="text-center text-sm text-gray-500">
              오후 10시에 새로운 질문이 도착해요
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleViewAnswer}
            activeOpacity={0.7}
            className="flex-row items-center justify-center gap-1 mt-2"
          >
            <Text className="text-sm text-onsikku-dark-orange font-medium">
              내 답변 보기
            </Text>
            <ChevronRight size={16} color="#F97315" />
          </TouchableOpacity>
          {!questionInstanceId && (
            <Text className="text-center text-xs text-red-500 mt-2">
              질문 정보가 없습니다. (디버깅)
            </Text>
          )}
        </>
      ) : (
        <GeneralButton 
          text="나의 생각 들려주기" 
          isActive={isActive} 
          onPress={handlePress}
        />
      )}
    </View>
  );
}
