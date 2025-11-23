
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createAnswer, setAccessToken } from "@/utils/api";
import { getItem } from "@/utils/AsyncStorage";

export default function ReplyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    questionAssignmentId?: string;
    question?: string;
  }>();
  
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const characterLimit = 500;
  
  const question = params.question || "오늘 하루 어떠셨나요?\n위로받고 싶은 일이 있었나요?";
  const questionAssignmentId = params.questionAssignmentId;

  const handleSubmit = async () => {
    if (!questionAssignmentId) {
      Alert.alert("오류", "질문 정보가 없습니다.");
      return;
    }

    if (!reply.trim()) {
      Alert.alert("확인", "답변을 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      const token = await getItem("accessToken");
      console.log("[답변 등록] 토큰 확인:", token ? "있음" : "없음");
      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다. 다시 로그인해주세요.");
        return;
      }
      setAccessToken(token);
      console.log("[답변 등록] 요청 데이터:", {
        questionAssignmentId,
        answerType: "TEXT",
        content: reply.trim(),
      });
      
      await createAnswer({
        questionAssignmentId,
        answerType: "TEXT",
        content: reply.trim(),
      });
      
      Alert.alert("완료", "답변이 등록되었습니다.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      console.error("[답변 생성 에러]", e);
      const errorMessage = e?.message || "답변 등록에 실패했습니다.";
      
      // 403 또는 401 에러인 경우 권한 문제로 처리
      if (errorMessage.includes("403") || errorMessage.includes("401") || errorMessage.includes("Forbidden") || errorMessage.includes("Unauthorized")) {
        Alert.alert(
          "권한 오류",
          "답변을 등록할 권한이 없습니다. 로그인 상태를 확인해주세요.",
          [
            { text: "확인", onPress: () => router.replace("/(tabs)/mypage") },
          ]
        );
      } else {
        Alert.alert("오류", errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView edges={["bottom"]} className="flex-1 bg-orange-50">
        <View className="flex-1 p-5 gap-5">
          {/* Question Section */}
          <View className="bg-white p-6 rounded-2xl shadow-sm">
            <View className="flex-row items-center mb-4">
              <Ionicons name="chatbubble-outline" size={24} color="#F97315" />
              <Text className="text-lg font-bold text-gray-800 ml-2">
                오늘의 질문
              </Text>
            </View>
            <View className="bg-orange-50 p-4 rounded-lg">
              <Text className="text-base text-gray-700 leading-6">
                {question}
              </Text>
            </View>
          </View>

          {/* Reply Section */}
          <View className="bg-white p-6 rounded-2xl shadow-sm flex-1">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              나의 생각 들려주기 😊
            </Text>
            <TextInput
              className="bg-orange-50 p-4 rounded-lg text-base text-gray-700 leading-6 h-48"
              multiline
              textAlignVertical="top"
              placeholder="오늘 하루 있었던 일이나 느낀 점을 자유롭게 써주세요. 가족들이 따뜻하게 들어줄 거예요."
              value={reply}
              onChangeText={setReply}
              maxLength={characterLimit}
            />
            <Text className="text-right text-gray-500 mt-2">
              {reply.length}/{characterLimit}자
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || !reply.trim()}
            className={`p-4 rounded-2xl flex-row justify-center items-center shadow-sm ${
              submitting || !reply.trim() ? "bg-gray-300" : "bg-orange-400"
            }`}
          >
            <Ionicons name="send-outline" size={20} color="white" />
            <Text className="text-white text-base font-bold ml-2">
              {submitting ? "등록 중..." : "답변 등록하기 💝"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
