import { createAnswer, setAccessToken } from "@/utils/api";
import { getItem } from "@/utils/AsyncStorage";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReplyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    questionAssignmentId?: string;
    question?: string;
  }>();

  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const characterLimit = 500;

  const question =
    params.question || "오늘 하루 어떠셨나요?\n위로받고 싶은 일이 있었나요?";
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
      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다. 다시 로그인해주세요.");
        return;
      }
      setAccessToken(token);

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

      if (
        errorMessage.includes("403") ||
        errorMessage.includes("401") ||
        errorMessage.includes("Forbidden") ||
        errorMessage.includes("Unauthorized")
      ) {
        Alert.alert(
          "권한 오류",
          "답변을 등록할 권한이 없습니다. 로그인 상태를 확인해주세요.",
          [{ text: "확인", onPress: () => router.replace("/(tabs)/mypage") }]
        );
      } else {
        Alert.alert("오류", errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-orange-50">
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Header */}
          <View className="px-4 py-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-6">
            {/* Question Section */}
            <View className="items-center mb-6 px-2">
              <Text className="font-sans text-2xl font-bold leading-9 text-center text-gray-900">
                <Text className="text-orange-500">Q. </Text>
                {question}
              </Text>
            </View>

            {/* Input Section */}
            <View className="flex-1 mb-4">
              <View className="bg-white rounded-3xl p-5 shadow-sm flex-1">
                <TextInput
                  className="font-sans text-base text-gray-800 leading-relaxed flex-1"
                  multiline
                  textAlignVertical="top"
                  placeholder="오늘 하루 있었던 일이나 느낀 점을 자유롭게 써주세요. 가족들이 따뜻하게 들어줄 거예요."
                  placeholderTextColor="#9CA3AF"
                  value={reply}
                  onChangeText={setReply}
                  maxLength={characterLimit}
                />
                <Text className="font-sans text-right text-sm text-gray-400 mt-2">
                  {reply.length}/{characterLimit}자
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <View className="mb-6">
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting || !reply.trim()}
                activeOpacity={0.8}
                className={`w-full py-4 rounded-full flex-row justify-center items-center shadow-sm ${
                  submitting || !reply.trim()
                    ? "bg-gray-300"
                    : "bg-onsikku-dark-orange"
                }`}
              >
                {submitting ? (
                  <Text className="font-sans text-white text-lg font-bold">
                    등록 중...
                  </Text>
                ) : (
                  <>
                    <Text className="font-sans text-white text-lg font-bold mr-2">
                      답변 등록하기
                    </Text>
                    <Ionicons name="send" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
