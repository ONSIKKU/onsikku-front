import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Answer, getQuestionInstanceDetails, setAccessToken } from "@/utils/api";
import { getItem } from "@/utils/AsyncStorage";
import { familyRoleToKo } from "@/utils/labels";

// Instagram 스타일 시간 포맷
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "방금 전";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}분 전`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}시간 전`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours % 12 || 12;
    return `${month}월 ${day}일 ${ampm} ${displayHours}:${minutes.toString().padStart(2, "0")}`;
  }
};

interface ReplyDetailScreenProps {}

// 댓글 타입 정의
type Comment = {
  id: string;
  content: string;
  createdAt: string;
  member?: {
    id: string;
    familyRole: string;
    profileImageUrl: string | null;
  };
  parent?: Comment;
};

// Instagram 스타일 피드 카드
const FeedCard = ({ 
  answer, 
  commentCount 
}: { 
  answer: Answer;
  commentCount: number;
}) => {
  const familyRole = answer.member?.familyRole || answer.familyRole || "PARENT";
  const roleName = familyRoleToKo(familyRole);
  const timeAgo = answer.createdAt ? formatTimeAgo(answer.createdAt) : "";
  const profileImageUrl = answer.member?.profileImageUrl || null;

  // content가 문자열인 경우와 객체인 경우 처리
  const contentText =
    typeof answer.content === "string"
      ? answer.content
      : answer.content?.text || JSON.stringify(answer.content);

  // 반응 개수 합계
  const totalReactions =
    (answer.likeReactionCount || 0) +
    (answer.angryReactionCount || 0) +
    (answer.sadReactionCount || 0) +
    (answer.funnyReactionCount || 0);

  return (
    <View>
      {/* 헤더: 프로필 이미지 + 이름 + 시간 + 하트 */}
      <View className="flex-row items-center justify-between p-4 pb-3">
        <View className="flex-row items-center gap-3">
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
          <View>
            <Text className="text-base font-semibold text-gray-900">{roleName}</Text>
            <Text className="text-xs text-gray-500">{timeAgo}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 답변 내용 */}
      <View className="px-4 pb-4">
        <Text className="text-base text-gray-900 leading-6">{contentText}</Text>
      </View>

      {/* 반응 버튼 및 댓글 개수 */}
      <View className="px-4 pb-4 border-t border-gray-100 pt-3">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="flex-row items-center gap-2">
            <Ionicons name="chatbubble-outline" size={20} color="#000" />
            <Text className="text-sm text-gray-600">
              {commentCount > 0 ? `대댓글 ${commentCount}개` : ""}
            </Text>
          </TouchableOpacity>
        </View>
        {totalReactions > 0 && (
          <Text className="text-sm text-gray-600 mt-2">
            좋아요 {totalReactions}개
          </Text>
        )}
      </View>
    </View>
  );
};

// 댓글 카드
const CommentCard = ({ comment }: { comment: Comment }) => {
  const familyRole = comment.member?.familyRole || "PARENT";
  const roleName = familyRoleToKo(familyRole);
  const timeAgo = comment.createdAt ? formatTimeAgo(comment.createdAt) : "";
  const profileImageUrl = comment.member?.profileImageUrl || null;

  return (
    <View className="px-4 py-3 border-b border-gray-100 last:border-b-0">
      <View className="flex-row gap-3">
        {profileImageUrl ? (
          <Image
            source={{ uri: profileImageUrl }}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center">
            <Ionicons name="person" size={16} color="#FB923C" />
          </View>
        )}
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-sm font-semibold text-gray-900">{roleName}</Text>
            <Text className="text-xs text-gray-500">{timeAgo}</Text>
          </View>
          <Text className="text-sm text-gray-800 leading-5 mb-2">{comment.content}</Text>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity className="flex-row items-center gap-1">
              <Ionicons name="heart-outline" size={16} color="#000" />
              <Text className="text-xs text-gray-500">0</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-xs text-gray-500">답글</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionContent, setQuestionContent] = useState<string>("");

  const questionInstanceId = params.questionInstanceId;
  const question = params.question || "질문 정보가 없습니다.";

  useEffect(() => {
    const fetchData = async () => {
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

        // 질문 인스턴스 상세 조회 (답변 + 댓글 포함)
        const questionData = await getQuestionInstanceDetails(questionInstanceId);
        
        // 질문 내용
        const content = questionData.questionDetails?.questionContent || question;
        setQuestionContent(content);

        // 답변 목록
        const answerList = questionData.questionDetails?.answers || [];
        const convertedAnswers: Answer[] = answerList.map((ans: any) => ({
          ...ans,
          id: ans.answerId,
        }));
        setAnswers(convertedAnswers);

        // 댓글 목록
        const commentList = questionData.questionDetails?.comments || [];
        setComments(commentList as Comment[]);
      } catch (e: any) {
        console.error("[답변 조회 에러]", e);
        setError(e?.message || "답변을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionInstanceId]);

  // 각 답변별 댓글 개수 계산
  const getCommentCountForAnswer = (answerId: string) => {
    // 댓글이 특정 답변에 연결되어 있는지 확인
    // 현재 API 구조상 댓글이 답변 ID로 연결되어 있지 않을 수 있으므로
    // 일단 전체 댓글 개수를 반환
    return comments.length;
  };

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-orange-50">
      <ScrollView>
        <View className="p-5 gap-5">
          {/* 질문 헤더 */}
          <View className="bg-white p-6 rounded-2xl shadow-sm">
            <View className="flex-row items-center mb-4">
              <Ionicons name="chatbubble-outline" size={24} color="#F97315" />
              <Text className="text-lg font-bold text-gray-800 ml-2">오늘의 질문</Text>
            </View>
            <View className="bg-orange-50 p-4 rounded-lg">
              <Text className="text-base text-gray-700 leading-6">{questionContent || question}</Text>
            </View>
          </View>

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
              <Text className="text-gray-500 text-center">아직 답변이 없습니다.</Text>
            </View>
          ) : (
            <>
              {/* 답변 개수 표시 */}
              <View className="px-2">
                <Text className="text-sm font-medium text-gray-700">
                  답변 {answers.length}개
                </Text>
              </View>

              {/* 답변 피드 */}
              {answers.map((answer) => (
                <View key={answer.id || answer.answerId} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <FeedCard
                    answer={answer}
                    commentCount={getCommentCountForAnswer(answer.answerId || answer.id || "")}
                  />
                </View>
              ))}

              {/* 댓글 섹션 */}
              {comments.length > 0 && (
                <>
                  <View className="px-2">
                    <Text className="text-sm font-semibold text-gray-900">대댓글</Text>
                  </View>
                  <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {comments.map((comment) => (
                      <CommentCard key={comment.id} comment={comment} />
                    ))}
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
