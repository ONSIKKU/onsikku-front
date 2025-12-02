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
const ITEM_WIDTH = width - 40;

export default function NotAssignedScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [questions, setQuestions] = useState<QuestionAssignment[]>([]);
  const [familyMembers, setFamilyMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string>("");
  const [questionContent, setQuestionContent] = useState<string>("");
  const [recentAnswers, setRecentAnswers] = useState<Answer[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserGender, setCurrentUserGender] = useState<string | null>(null);

  // Mock Data for "Not Assigned" state
  useEffect(() => {
    const loadMockData = async () => {
      setLoading(true);
      try {
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 500));

        const token = await getItem("accessToken");
        if (token) setAccessToken(token);

        // Mock Current User (Me)
        const mockMeId = "user-me";
        setCurrentUserId(mockMeId);
        setCurrentUserRole("CHILD");
        setCurrentUserGender("MALE");

        // Mock Family Members
        const mockMembers: Member[] = [
          { id: mockMeId, familyRole: "CHILD", gender: "MALE", profileImageUrl: "", role: "MEMBER", birthDate: "", createdAt: "", updatedAt: "", alarmEnabled: true },
          { id: "user-mom", familyRole: "PARENT", gender: "FEMALE", profileImageUrl: "", role: "MEMBER", birthDate: "", createdAt: "", updatedAt: "", alarmEnabled: true },
          { id: "user-dad", familyRole: "PARENT", gender: "MALE", profileImageUrl: "", role: "MEMBER", birthDate: "", createdAt: "", updatedAt: "", alarmEnabled: true },
        ];
        setFamilyMembers(mockMembers);

        // Mock Question Assignments (Assigned to Mom)
        const mockAssignments: QuestionAssignment[] = [
          {
            id: "assignment-1",
            member: mockMembers[1], // Mom
            state: "SENT",
            dueAt: "", sentAt: "", readAt: null, answeredAt: null, expiredAt: null, reminderCount: 0, lastRemindedAt: null
          }
        ];
        setQuestions(mockAssignments);

        // Mock Question Content
        setQuestionContent("가족들과 함께 가고 싶은 여행지가 있나요?");

        // Mock Recent Answers
        setRecentAnswers([]); 
      } catch (e) {
        setError("데이터 로드 실패");
      } finally {
        setLoading(false);
      }
    };
    loadMockData();
  }, []);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    setActiveIndex(index);
  };

  const recentAnswersData = recentAnswers.map((answer) => {
    // ... (same logic as home)
    return {}; // Empty for mock
  });

  // Determine Logic (Not Assigned)
  const currentUserQuestion = questions.find((q) => q.member?.id === currentUserId);
  const currentQuestion = currentUserQuestion || questions[0]; // Show assigned question
  const hasUserAssignment = !!currentUserQuestion; // Should be false
  const hasAnsweredToday = false;
  const isQuestionEmpty = !questionContent;

  const displayQuestionContent = questionContent;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 w-full px-4 gap-6 bg-onsikku-main-orange justify-center items-center">
        <ActivityIndicator size="large" color="#FB923C" />
        <Text className="font-sans text-gray-600">로딩 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 w-full bg-orange-50" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="mb-6 mt-2">
          <Text className="font-sans text-gray-500 font-medium text-sm mb-1 ml-1">
            {new Date().toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </Text>
          <Text className="font-sans text-2xl font-bold text-gray-900 ml-1">
            반가워요,{" "}
            {getRoleIconAndText(
              currentUserRole as any,
              currentUserGender as any
            ).text || "가족"}
            님! 👋
          </Text>
        </View>

        <View className="gap-6">
          <TodayRespondent
            members={familyMembers}
            assignments={questions}
            currentUserId={currentUserId}
          />
          
          {/* Note: TodayQuestion logic handles !isActive by graying out button. */}
          <TodayQuestion
            question={displayQuestionContent}
            questionAssignmentId={currentQuestion?.id}
            questionInstanceId={undefined}
            isUserAssignment={hasUserAssignment} // FALSE
            isAnswered={hasAnsweredToday}
            isEmpty={isQuestionEmpty}
          />

          <View>
            <View className="flex flex-row justify-between items-center mb-3 px-1">
              <Text className="font-sans font-bold text-xl text-gray-800">
                지난 추억들 (Mock)
              </Text>
            </View>
            <View className="w-full items-center justify-center py-8">
              <Text className="font-sans text-gray-500 text-sm">
                아직 답변이 없습니다
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
