import { router } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface TodayQuestionProps {
  question: string;
  questionAssignmentId?: string;
  questionInstanceId?: string; // 질문 인스턴스 ID (답변 상세 페이지로 이동 시 필요)
  isUserAssignment?: boolean; // 현재 사용자에게 할당된 질문인지
  isAnswered?: boolean; // 답변 완료 여부
  isEmpty?: boolean;
}

export default function TodayQuestion({
  question,
  questionAssignmentId,
  questionInstanceId,
  isUserAssignment = false,
  isAnswered = false,
  isEmpty = false,
}: TodayQuestionProps) {
  const handlePress = () => {
    if (questionAssignmentId && isUserAssignment && !isAnswered) {
      router.push({
        pathname: "/reply",
        params: {
          questionAssignmentId,
          question,
        },
      });
    } else {
      // ignore
    }
  };

  const handleViewAnswer = () => {
    if (questionInstanceId) {
      router.push({
        pathname: "/reply-detail",
        params: {
          questionInstanceId,
          question,
        },
      });
    } else {
      // questionInstanceId가 없어도 questionAssignmentId가 있으면 시도
      if (questionAssignmentId) {
        // 일단 questionAssignmentId를 questionInstanceId로 사용 (임시)
        router.push({
          pathname: "/reply-detail",
          params: {
            questionInstanceId: questionAssignmentId, // 임시로 사용
            question,
          },
        });
      }
    }
  };

  // 질문이 없는지 확인
  const hasNoQuestion =
    isEmpty ||
    !question ||
    question.trim() === "" ||
    question === "질문이 없습니다" ||
    question === "새로운 질문을 기다려 주세요";

  // 현재 사용자에게 할당된 질문이고, 질문 내용이 있고, 아직 답변하지 않았으면 활성화
  const isActive =
    !hasNoQuestion &&
    isUserAssignment &&
    !!question &&
    !!questionAssignmentId &&
    !isAnswered &&
    question !== "오늘 하루 어떠셨나요?\n위로받고 싶은 일이 있었나요?";

  if (hasNoQuestion) {
    return (
      <View className="bg-white w-full p-8 rounded-3xl shadow-sm items-center justify-center min-h-[280px] gap-4">
        <View className="bg-orange-50 p-6 rounded-full">
          <MessageCircle color="#FB923C" size={40} strokeWidth={1.5} />
        </View>
        <View className="items-center gap-2">
          <Text className="font-bold text-xl text-gray-800 text-center">
            새로운 질문을 기다려 주세요
          </Text>
          <View className="bg-gray-50 px-4 py-2 rounded-full mt-1">
            <Text className="text-gray-500 text-center text-xs font-medium">
              매일 밤 9시 30분에 질문이 도착해요 🌙
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white w-full p-6 rounded-3xl shadow-sm">
      {/* 질문 영역 강조 */}
      <View className="items-center mb-6 px-2">
        <Text
          className={`font-sans text-xl font-bold leading-8 text-center ${
            hasNoQuestion ? "text-gray-400" : "text-gray-900"
          }`}
        >
          <Text className="text-orange-500">Q. </Text>
          {hasNoQuestion ? "질문이 없습니다" : question}
        </Text>
      </View>

      {/* 하단 상태 및 버튼 */}
      <View className="items-center w-full">
        {hasNoQuestion ? (
          <Text className="font-sans text-center text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
            새로운 질문을 기다려주세요 🌙
          </Text>
        ) : isAnswered ? (
          <>
            <TouchableOpacity
              onPress={handleViewAnswer}
              activeOpacity={0.7}
              className="bg-orange-100 px-6 py-3 rounded-full"
            >
              <Text className="font-sans font-bold text-orange-600 text-sm">
                {isUserAssignment ? "내 답변 보기" : "답변 보기"}
              </Text>
            </TouchableOpacity>
            {isUserAssignment && (
              <Text className="font-sans text-center text-xs text-gray-400 mt-3">
                오늘 답변을 완료했어요! 🎉
              </Text>
            )}
          </>
        ) : isUserAssignment ? (
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className="bg-onsikku-dark-orange px-10 py-3.5 rounded-full shadow-sm"
          >
            <Text className="font-sans font-bold text-white text-base">
              답변하기
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-gray-100 px-6 py-3 rounded-full">
            <Text className="font-sans font-bold text-gray-400 text-sm">
              답변을 기다리고 있어요 ⏳
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
