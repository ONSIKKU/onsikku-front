import RecentAnswers from "@/components/RecentAnswers";
import TodayQuestion from "@/components/TodayQuestion";
import TodayRespondent from "@/components/TodayRespondent";
import {
  Answer,
  apiFetch,
  getMyPage,
  getRecentAnswers,
  Member,
  QuestionAssignment,
  QuestionResponse,
  setAccessToken,
} from "@/utils/api";
import { getItem } from "@/utils/AsyncStorage";
import { getRoleIconAndText } from "@/utils/labels";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
// SafeAreaView (px-4 -> 16*2=32) + Container View (p-4 -> 16*2=32) = 64
const ITEM_WIDTH = width - 64;

export default function Page() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [questions, setQuestions] = useState<QuestionAssignment[]>([]);
  const [familyMembers, setFamilyMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string>("");
  const [questionContent, setQuestionContent] = useState<string>("");
  const [questionInstanceId, setQuestionInstanceId] = useState<string | null>(
    null
  );
  const [recentAnswers, setRecentAnswers] = useState<Answer[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserGender, setCurrentUserGender] = useState<string | null>(
    null
  );

  const fetchTodayQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = await getItem("accessToken");
      console.log("[액세스 토큰]", token || "토큰 없음");
      if (token) {
        setAccessToken(token);
        const response = await apiFetch<QuestionResponse>("/api/questions", {
          method: "GET",
        });

        // questionDetails에서 questionAssignments 가져오기
        const questionAssignments =
          response.questionDetails?.questionAssignments || [];
        setQuestions(questionAssignments);
        setFamilyMembers(response.familyMembers || []);

        // 질문 내용과 인스턴스 ID는 questionDetails에서 가져오기
        if (response.questionDetails) {
          const content = response.questionDetails.questionContent || "";
          const instanceId =
            response.questionDetails.questionInstanceId || null;
          setQuestionContent(content);
          setQuestionInstanceId(instanceId);
        }
      } else {
        setError("로그인이 필요합니다");
      }
    } catch (e: any) {
      console.error("[오늘의 질문 조회 에러]", e);
      setError(e?.message || "질문을 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecentAnswers = useCallback(async () => {
    try {
      setLoadingAnswers(true);
      const token = await getItem("accessToken");
      if (token) {
        setAccessToken(token);
        // 최근 1개월의 답변 중 최신 10개 조회
        const answers = await getRecentAnswers(1, 10);
        setRecentAnswers(answers);
      }
    } catch (e: any) {
      console.error("[최근 답변 조회 에러]", e);
      // 에러가 있어도 화면은 표시 (빈 배열로 처리)
      setRecentAnswers([]);
    } finally {
      setLoadingAnswers(false);
    }
  }, []);

  // 현재 사용자 ID 가져오기
  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = await getItem("accessToken");
      if (token) {
        setAccessToken(token);
        const myPageData = await getMyPage();
        // MypageResponse 구조 변경에 따른 수정 (member 객체 내부 접근)
        if (myPageData.member) {
          setCurrentUserId(myPageData.member.id);
          setCurrentUserRole(myPageData.member.familyRole);
          setCurrentUserGender(myPageData.member.gender);
        }
      }
    } catch (e: any) {
      console.error("[현재 사용자 조회 에러]", e);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
    fetchTodayQuestions();
    fetchRecentAnswers();
  }, [fetchCurrentUser, fetchTodayQuestions, fetchRecentAnswers]);

  useFocusEffect(
    useCallback(() => {
      fetchTodayQuestions();
      fetchRecentAnswers();
    }, [fetchTodayQuestions, fetchRecentAnswers])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchCurrentUser(),
        fetchTodayQuestions(),
        fetchRecentAnswers(),
      ]);
    } catch (e) {
      console.error("새로고침 실패", e);
    } finally {
      setRefreshing(false);
    }
  }, [fetchCurrentUser, fetchTodayQuestions, fetchRecentAnswers]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    setActiveIndex(index);
  };

  // 답변 데이터를 RecentAnswers 컴포넌트 형식으로 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}/${day}`;
  };

  const getContentText = (content: any): string => {
    if (typeof content === "string") {
      return content;
    }
    if (content?.text) {
      return content.text;
    }
    return JSON.stringify(content);
  };

  const recentAnswersData = recentAnswers.map((answer) => {
    const familyRole =
      answer.member?.familyRole || answer.familyRole || "PARENT";
    const gender = answer.member?.gender || answer.gender;
    const questionContent = answer.questionContent || "";
    const questionAssignmentId = answer.questionAssignment?.id || "";
    const questionInstanceId = answer.questionInstanceId || "";

    const { text: roleText, icon: roleIcon } = getRoleIconAndText(
      familyRole,
      gender
    );

    return {
      roleName: roleText,
      date: formatDate(answer.createdAt),
      content: getContentText(answer.content),
      questionAssignmentId,
      questionInstanceId,
      question: questionContent,
      roleIcon,
    };
  });

  // 현재 사용자에게 할당된 질문 찾기
  const currentUserQuestion = currentUserId
    ? questions.find((q) => q.member?.id === currentUserId)
    : null;

  // 현재 사용자에게 할당된 질문이 없으면 첫 번째 질문 사용 (호환성)
  const currentQuestion = currentUserQuestion || questions[0];

  const isQuestionEmpty = !questionContent || questionContent.trim() === "";

  // 질문 내용이 없거나 빈 문자열일 때 "질문이 없습니다" 표시
  const displayQuestionContent =
    questionContent && questionContent.trim() !== ""
      ? questionContent
      : "새로운 질문을 기다려 주세요";

  // 답변 대기 중인 사람 수 (SENT 상태이고 아직 답변 안 한 경우)
  const pendingCount = questions.filter(
    (q) => q.state === "SENT" && !q.answeredAt
  ).length;

  // 질문 대상 (subject) - 현재 사용자 정보 사용
  const questionSubject = currentUserQuestion?.member || null;

  // 현재 사용자에게 할당된 질문이 있는지 확인
  const hasUserAssignment = !!currentUserQuestion;

  // 현재 사용자가 오늘의 질문에 답변했는지 확인
  // state가 "ANSWERED"일 때만 답변 완료로 표시
  const hasAnsweredToday =
    currentUserQuestion?.state === "ANSWERED" ||
    currentQuestion?.state === "ANSWERED";

  // questionInstanceId: state에서 가져오기 (questionDetails.questionInstanceId)
  // 새로운 API 스펙에서는 questionDetails.questionInstanceId를 사용
  const displayQuestionInstanceId = questionInstanceId;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 w-full px-4 gap-6 bg-onsikku-main-orange justify-center items-center">
        <ActivityIndicator size="large" color="#FB923C" />
        <Text className="text-gray-600">질문을 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (error && questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 w-full px-4 gap-6 bg-onsikku-main-orange justify-center items-center">
        <Text className="text-red-500 text-center">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 w-full bg-orange-50">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FB923C"]} // 안드로이드용 색상
            tintColor="#FB923C" // iOS용 색상
          />
        }
      >
        {!isQuestionEmpty && (
          <TodayRespondent
            members={familyMembers}
            assignments={questions}
            currentUserId={currentUserId}
          />
        )}
        <TodayQuestion
          question={displayQuestionContent}
          questionAssignmentId={currentQuestion?.id}
          questionInstanceId={displayQuestionInstanceId || undefined}
          isUserAssignment={hasUserAssignment}
          isAnswered={hasAnsweredToday}
          isEmpty={isQuestionEmpty}
        />


        <View className="bg-white w-full p-5 rounded-3xl shadow-sm">
          <View className="flex flex-row justify-between items-center mb-4">
            <Text className="font-bold text-lg text-gray-800">
              지난 답변 둘러보기
            </Text>
          </View>

          {loadingAnswers ? (
            <View className="w-full items-center justify-center py-8">
              <ActivityIndicator size="small" color="#FB923C" />
              <Text className="text-gray-500 mt-2 text-sm">
                답변을 불러오는 중...
              </Text>
            </View>
          ) : recentAnswersData.length === 0 ? (
            <View className="w-full items-center justify-center py-8">
              <Text className="text-gray-500 text-sm">
                아직 답변이 없습니다
              </Text>
            </View>
          ) : (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={{ width: ITEM_WIDTH }}
              >
                {recentAnswersData.map((item, index) => (
                  <View
                    style={{ width: ITEM_WIDTH, paddingHorizontal: 8 }}
                    key={index}
                  >
                    <RecentAnswers
                      {...item}
                      roleIcon={item.roleIcon}
                      onPress={() => {
                        if (item.questionInstanceId) {
                          router.push({
                            pathname: "/reply-detail",
                            params: {
                              questionInstanceId: item.questionInstanceId,
                              question: item.question,
                            },
                          });
                        }
                      }}
                    />
                  </View>
                ))}
              </ScrollView>

              <View className="flex-row justify-center items-center gap-2 mt-3">
                {recentAnswersData.map((_, index) => (
                  <View
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      activeIndex === index
                        ? "bg-onsikku-dark-orange"
                        : "bg-orange-200"
                    }`}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
