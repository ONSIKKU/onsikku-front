import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Answer, getAnswers, setAccessToken } from "@/utils/api";
import { getItem } from "@/utils/AsyncStorage";
import { familyRoleToKo } from "@/utils/labels";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";
  const displayHours = hours % 12 || 12;
  return `${month}월 ${day}일 ${ampm} ${displayHours}:${minutes.toString().padStart(2, "0")}`;
};

interface ReplyDetailScreenProps {}

const QuestionDisplay = ({ question }: { question: string }) => (
  <View className="bg-white p-6 rounded-2xl shadow-sm">
    <View className="flex-row items-center mb-4">
      <Ionicons name="chatbubble-outline" size={24} color="#F97315" />
      <Text className="text-lg font-bold text-gray-800 ml-2">오늘의 질문</Text>
    </View>
    <View className="bg-orange-50 p-4 rounded-lg">
      <Text className="text-base text-gray-700 leading-6">{question}</Text>
    </View>
  </View>
);

const AnswerCard = ({ answer }: { answer: Answer }) => {
  // 호환성을 위해 member 또는 직접 필드 사용
  const familyRole = answer.member?.familyRole || answer.familyRole || "PARENT";
  const roleName = familyRoleToKo(familyRole);
  const formattedDate = answer.createdAt ? formatDate(answer.createdAt) : "";
  const profileImageUrl = answer.member?.profileImageUrl || null;

  // content가 문자열인 경우와 객체인 경우 처리
  const contentText =
    typeof answer.content === "string"
      ? answer.content
      : answer.content?.text || JSON.stringify(answer.content);

  return (
    <View className="bg-white p-6 rounded-2xl shadow-sm">
      <View className="flex-row items-center mb-4">
        {profileImageUrl ? (
          <Image
            source={{ uri: profileImageUrl }}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center">
            <Ionicons name="person" size={20} color="#FB923C" />
          </View>
        )}
        <View className="ml-3">
          <Text className="text-base font-bold">{roleName}</Text>
          <Text className="text-sm text-gray-500">{formattedDate}</Text>
        </View>
      </View>
      <View className="bg-gray-100 p-4 rounded-lg">
        <Text className="text-base text-gray-800 leading-6">{contentText}</Text>
      </View>
    </View>
  );
};

export default function ReplyDetailScreen() {
  const params = useLocalSearchParams<{
    questionAssignmentId?: string;
    question?: string;
    questionInstanceId?: string;
  }>();

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const questionAssignmentId = params.questionAssignmentId;
  const questionInstanceId = params.questionInstanceId;
  const question = params.question || "질문 정보가 없습니다.";

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!questionInstanceId) {
        setError("질문 정보가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const token = await getItem("accessToken");
        if (token) {
          setAccessToken(token);
        }

        const data = await getAnswers(questionInstanceId);
        setAnswers(data);
      } catch (e: any) {
        console.error("[답변 조회 에러]", e);
        setError(e?.message || "답변을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [questionInstanceId]);

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-orange-50">
      <ScrollView>
        <View className="p-5 gap-5">
          <QuestionDisplay question={question} />

          {loading ? (
            <View className="bg-white p-6 rounded-2xl shadow-sm items-center justify-center">
              <ActivityIndicator size="large" color="#F97315" />
              <Text className="text-gray-500 mt-4">답변을 불러오는 중...</Text>
            </View>
          ) : error ? (
            <View className="bg-white p-6 rounded-2xl shadow-sm">
              <Text className="text-red-500 text-center">{error}</Text>
            </View>
          ) : answers.length === 0 ? (
            <View className="bg-white p-6 rounded-2xl shadow-sm">
              <Text className="text-gray-500 text-center">
                아직 답변이 없습니다.
              </Text>
            </View>
          ) : (
            answers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
