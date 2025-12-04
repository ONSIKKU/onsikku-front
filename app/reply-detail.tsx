import {
  addReaction,
  Answer,
  Comment,
  createComment,
  deleteAnswer,
  deleteComment,
  getMyPage,
  getQuestionInstanceDetails,
  setAccessToken,
  updateAnswer,
  updateComment,
} from "@/utils/api";
import { getItem } from "@/utils/AsyncStorage";
import { getRoleIconAndText } from "@/utils/labels";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Instagram 스타일 시간 포맷
const formatTimeAgo = (dateString: string) => {
  const date = new Date(
    dateString.endsWith("Z") ? dateString : dateString + "Z"
  );
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
    return `${month}월 ${day}일 ${ampm} ${displayHours}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }
};

interface ReplyDetailScreenProps {}

// ----------------------------------------------------------------------
// Reaction Button Component
// ----------------------------------------------------------------------
const ReactionButton = ({
  icon,
  count,
  onPress,
}: {
  icon: string;
  count: number;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-1 px-2 py-1"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text className="font-sans text-xs text-gray-500 font-medium">
        {count}
      </Text>
    </Pressable>
  );
};

// ----------------------------------------------------------------------
// Feed Card (Answer)
// ----------------------------------------------------------------------
const FeedCard = ({
  answer,
  isMyAnswer,
  onEdit,
  onDelete,
  onReaction,
}: {
  answer: Answer;
  isMyAnswer: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReaction: (type: "LIKE" | "ANGRY" | "SAD" | "FUNNY") => void;
}) => {
  const familyRole = answer.member?.familyRole || answer.familyRole || "PARENT";
  const gender = answer.member?.gender || answer.gender;
  const { text: roleName } = getRoleIconAndText(familyRole, gender);
  const timeAgo = answer.createdAt ? formatTimeAgo(answer.createdAt) : "";

  // content가 문자열인 경우와 객체인 경우 처리
  const contentText =
    typeof answer.content === "string"
      ? answer.content
      : answer.content?.text || JSON.stringify(answer.content);

  return (
    <View className="bg-white mb-4 pb-4 rounded-2xl shadow-sm">
      {/* 헤더 */}
      <View className="flex-row items-start justify-between px-4 py-3">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center">
            <Text className="text-xl">
              {getRoleIconAndText(familyRole, gender).icon}
            </Text>
          </View>
          <View>
            <View className="flex-row items-center gap-1">
              <Text className="font-sans text-base font-semibold text-gray-900">
                {roleName}
              </Text>
            </View>
            <Text className="font-sans text-xs text-gray-400 mt-0.5">
              {timeAgo}
            </Text>
          </View>
        </View>

        {isMyAnswer && (
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={onEdit}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="create-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 내용 */}
      <View className="pb-2 px-4">
        <Text className="font-sans text-base text-gray-900 leading-relaxed">
          {contentText}
        </Text>
      </View>

      {/* 반응 버튼 영역 */}
      <View className="flex-row justify-around px-4 pt-2 mt-2 border-t border-gray-50">
        <ReactionButton
          icon="👍"
          count={answer.likeReactionCount}
          onPress={() => onReaction("LIKE")}
        />
        <ReactionButton
          icon="😆"
          count={answer.funnyReactionCount}
          onPress={() => onReaction("FUNNY")}
        />
        <ReactionButton
          icon="😭"
          count={answer.sadReactionCount}
          onPress={() => onReaction("SAD")}
        />
        <ReactionButton
          icon="😡"
          count={answer.angryReactionCount}
          onPress={() => onReaction("ANGRY")}
        />
      </View>
    </View>
  );
};

// ----------------------------------------------------------------------
// Comment Card
// ----------------------------------------------------------------------
const CommentCard = ({
  comment,
  isMyComment,
  isReply = false,
  onEdit,
  onDelete,
  onReply,
}: {
  comment: Comment;
  isMyComment: boolean;
  isReply?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReply: () => void;
}) => {
  const familyRole =
    comment.member?.familyRole || comment.familyRole || "PARENT";
  const gender = comment.member?.gender || comment.gender;
  const { text: roleName } = getRoleIconAndText(familyRole, gender);
  const timeAgo = comment.createdAt ? formatTimeAgo(comment.createdAt) : "";

  return (
    <View
      className={`flex-row py-4 border-b border-gray-50 last:border-b-0 ${
        isReply ? "pl-12 pr-4 bg-gray-50/50" : "px-4 bg-white"
      }`}
    >
      {/* 대댓글일 경우 연결선 아이콘 표시 (선택 사항) */}
      {isReply && (
        <View className="absolute left-5 top-4 mr-1">
          <Ionicons
            name="return-down-forward-outline"
            size={20}
            color="#D1D5DB"
          />
        </View>
      )}

      {/* 프로필 */}
      <View className="mr-3">
        <View
          className={`${
            isReply ? "w-7 h-7" : "w-9 h-9"
          } rounded-full bg-gray-100 items-center justify-center`}
        >
          <Text className={isReply ? "text-xs" : "text-sm"}>
            {getRoleIconAndText(familyRole, gender).icon}
          </Text>
        </View>
      </View>

      {/* 내용 영역 */}
      <View className="flex-1">
        {/* 이름 + 시간 + 액션 */}
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center gap-2">
            <Text
              className={`${
                isReply ? "text-xs" : "text-sm"
              } font-sans font-semibold text-gray-900`}
            >
              {roleName}
            </Text>
            <Text className="font-sans text-xs text-gray-400">{timeAgo}</Text>
          </View>

          <View className="flex-row items-center gap-3">
            {isMyComment && (
              <>
                <TouchableOpacity
                  onPress={onEdit}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <Ionicons name="create-outline" size={16} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onDelete}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <Text className="font-sans text-sm text-gray-900 leading-relaxed mb-2">
          {comment.content}
        </Text>

        {/* 대댓글에는 답글 달기 버튼 숨기기 (1뎁스만 허용할 경우) */}
        {!isReply && (
          <TouchableOpacity
            onPress={onReply}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 10 }}
          >
            <Text className="font-sans text-xs font-medium text-gray-500">
              답글 달기
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ----------------------------------------------------------------------
// Main Screen
// ----------------------------------------------------------------------
export default function ReplyDetailScreen() {
  const router = useRouter();
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [questionAssignments, setQuestionAssignments] = useState<any[]>([]);

  // Edit Answer State
  const [editingAnswer, setEditingAnswer] = useState<Answer | null>(null);
  const [editText, setEditText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit Comment State
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [showEditCommentModal, setShowEditCommentModal] = useState(false);

  // New Comment State
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingToComment, setReplyingToComment] = useState<Comment | null>(
    null
  );

  const questionInstanceId = params.questionInstanceId;
  const question = params.question || "질문 정보가 없습니다.";

  // --- Data Fetching ---
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

        try {
          const myPage = await getMyPage();
          // MypageResponse 구조 변경 대응
          setCurrentUserId(myPage.member?.id || null);
        } catch (e) {
          console.error("[사용자 정보 조회 에러]", e);
        }

        const questionData = await getQuestionInstanceDetails(
          questionInstanceId
        );

        const content =
          questionData.questionDetails?.questionContent || question;
        setQuestionContent(content);

        const assignments =
          questionData.questionDetails?.questionAssignments || [];
        setQuestionAssignments(assignments);

        const answerList = questionData.questionDetails?.answers || [];
        const convertedAnswers: Answer[] = answerList.map((ans: any) => ({
          ...ans,
          id: ans.answerId,
        }));
        setAnswers(convertedAnswers);

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

  const getQuestionAssignmentIdForAnswer = (answer: Answer): string | null => {
    const assignment = questionAssignments.find(
      (qa) => qa.member?.id === answer.memberId
    );
    return assignment?.id || null;
  };

  // --- Handlers ---
  const handleEditAnswer = (answer: Answer) => {
    const contentText =
      typeof answer.content === "string"
        ? answer.content
        : answer.content?.text || "";
    setEditingAnswer(answer);
    setEditText(contentText);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAnswer || !editText.trim()) {
      Alert.alert("확인", "답변 내용을 입력해주세요.");
      return;
    }

    try {
      const questionAssignmentId =
        getQuestionAssignmentIdForAnswer(editingAnswer);
      if (!questionAssignmentId) {
        Alert.alert("오류", "질문 할당 정보를 찾을 수 없습니다.");
        return;
      }

      const token = await getItem("accessToken");
      if (token) {
        setAccessToken(token);
      }

      await updateAnswer({
        answerId: editingAnswer.answerId,
        questionAssignmentId,
        answerType: "TEXT",
        content: editText.trim(),
      });

      const questionData = await getQuestionInstanceDetails(
        questionInstanceId!
      );
      const answerList = questionData.questionDetails?.answers || [];
      const convertedAnswers: Answer[] = answerList.map((ans: any) => ({
        ...ans,
        id: ans.answerId,
      }));
      setAnswers(convertedAnswers);
      const commentList = questionData.questionDetails?.comments || [];
      setComments(commentList as Comment[]);

      setShowEditModal(false);
      setEditingAnswer(null);
      setEditText("");
      Alert.alert("완료", "답변이 수정되었습니다.");
    } catch (e: any) {
      console.error("[답변 수정 에러]", e);
      Alert.alert("오류", e?.message || "답변 수정에 실패했습니다.");
    }
  };

  const handleDeleteAnswer = (answer: Answer) => {
    Alert.alert("답변 삭제", "정말 이 답변을 삭제하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const questionAssignmentId =
              getQuestionAssignmentIdForAnswer(answer);
            if (!questionAssignmentId) {
              Alert.alert("오류", "질문 할당 정보를 찾을 수 없습니다.");
              return;
            }

            const token = await getItem("accessToken");
            if (token) {
              setAccessToken(token);
            }

            await deleteAnswer({
              answerId: answer.answerId,
              questionAssignmentId,
            });

            const questionData = await getQuestionInstanceDetails(
              questionInstanceId!
            );
            const answerList = questionData.questionDetails?.answers || [];
            const convertedAnswers: Answer[] = answerList.map((ans: any) => ({
              ...ans,
              id: ans.answerId,
            }));
            setAnswers(convertedAnswers);
            const commentList = questionData.questionDetails?.comments || [];
            setComments(commentList as Comment[]);

            Alert.alert("완료", "답변이 삭제되었습니다.");
          } catch (e: any) {
            console.error("[답변 삭제 에러]", e);
            Alert.alert("오류", e?.message || "답변 삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const handleReaction = async (
    answer: Answer,
    reactionType: "LIKE" | "ANGRY" | "SAD" | "FUNNY"
  ) => {
    try {
      const token = await getItem("accessToken");
      if (token) {
        setAccessToken(token);
      }

      await addReaction({
        answerId: answer.answerId,
        reactionType,
      });

      // 화면 갱신 (재조회)
      // 낙관적 업데이트보다는 정확성을 위해 재조회 사용 (반응 카운트는 서버에서 계산됨)
      const questionData = await getQuestionInstanceDetails(
        questionInstanceId!
      );
      const answerList = questionData.questionDetails?.answers || [];
      const convertedAnswers: Answer[] = answerList.map((ans: any) => ({
        ...ans,
        id: ans.answerId,
      }));
      setAnswers(convertedAnswers);
    } catch (e: any) {
      console.error("[반응 추가 에러]", e);
      Alert.alert("오류", e?.message || "반응을 남기지 못했습니다.");
    }
  };

  const handleCreateComment = async () => {
    if (!questionInstanceId || !newCommentText.trim()) {
      Alert.alert("확인", "댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const token = await getItem("accessToken");
      if (token) {
        setAccessToken(token);
      }

      await createComment({
        questionInstanceId,
        content: newCommentText.trim(),
        parentCommentId: replyingToComment?.id,
      });

      const questionData = await getQuestionInstanceDetails(questionInstanceId);
      const commentList = questionData.questionDetails?.comments || [];
      setComments(commentList as Comment[]);

      setNewCommentText("");
      setReplyingToComment(null);
    } catch (e: any) {
      console.error("[댓글 생성 에러]", e);
      Alert.alert("오류", e?.message || "댓글 작성에 실패했습니다.");
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditCommentText(comment.content);
    setShowEditCommentModal(true);
  };

  const handleSaveCommentEdit = async () => {
    if (!editingComment || !editCommentText.trim() || !questionInstanceId) {
      Alert.alert("확인", "댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const token = await getItem("accessToken");
      if (token) {
        setAccessToken(token);
      }

      await updateComment({
        questionInstanceId,
        commentId: editingComment.id,
        content: editCommentText.trim(),
      });

      const questionData = await getQuestionInstanceDetails(questionInstanceId);
      const commentList = questionData.questionDetails?.comments || [];
      setComments(commentList as Comment[]);

      setShowEditCommentModal(false);
      setEditingComment(null);
      setEditCommentText("");
      Alert.alert("완료", "댓글이 수정되었습니다.");
    } catch (e: any) {
      console.error("[댓글 수정 에러]", e);
      Alert.alert("오류", e?.message || "댓글 수정에 실패했습니다.");
    }
  };

  const handleDeleteComment = (comment: Comment) => {
    Alert.alert("댓글 삭제", "정말 이 댓글을 삭제하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await getItem("accessToken");
            if (token) {
              setAccessToken(token);
            }

            await deleteComment(comment.id);

            const questionData = await getQuestionInstanceDetails(
              questionInstanceId!
            );
            const commentList = questionData.questionDetails?.comments || [];
            setComments(commentList as Comment[]);

            Alert.alert("완료", "댓글이 삭제되었습니다.");
          } catch (e: any) {
            console.error("[댓글 삭제 에러]", e);
            Alert.alert("오류", e?.message || "댓글 삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const handleReplyComment = (comment: Comment) => {
    setReplyingToComment(comment);
  };

  // 댓글을 계층형으로 정렬 및 렌더링
  const renderComments = () => {
    // 1. 부모 댓글(parent가 없는 것)만 필터링
    const rootComments = comments.filter((c) => !c.parent);

    return rootComments.map((rootComment) => {
      const isMyRootComment = currentUserId === rootComment.member?.id;

      // 2. 해당 부모의 대댓글(parent.id가 일치하는 것) 필터링
      const childComments = comments.filter(
        (c) => c.parent?.id === rootComment.id
      );

      return (
        <View key={rootComment.id}>
          {/* 부모 댓글 */}
          <CommentCard
            comment={rootComment}
            isMyComment={isMyRootComment}
            isReply={false}
            onEdit={() => handleEditComment(rootComment)}
            onDelete={() => handleDeleteComment(rootComment)}
            onReply={() => handleReplyComment(rootComment)}
          />

          {/* 자식 댓글들 (대댓글) */}
          {childComments.map((childComment) => {
            const isMyChildComment = currentUserId === childComment.member?.id;
            return (
              <CommentCard
                key={childComment.id}
                comment={childComment}
                isMyComment={isMyChildComment}
                isReply={true}
                onEdit={() => handleEditComment(childComment)}
                onDelete={() => handleDeleteComment(childComment)}
                onReply={() => handleReplyComment(childComment)}
              />
            );
          })}
        </View>
      );
    });
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-orange-50">
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <View className="px-4 py-2 flex-row items-center mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="font-sans text-xl font-bold text-gray-900">
            답변 상세
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Section (Modern Style) */}
          <View className="items-center mb-6 mt-4 px-2">
            <Text className="font-sans text-2xl font-bold leading-9 text-center text-gray-900">
              <Text className="text-orange-500">Q. </Text>
              {questionContent || question}
            </Text>
          </View>

          {/* 답변 목록 */}
          <View>
            {loading ? (
              <View className="py-10 items-center">
                <ActivityIndicator color="#F97315" />
              </View>
            ) : (
              <>
                {/* 답변 헤더 */}
                <View className="py-2 mb-2 flex-row justify-between items-center">
                  <Text className="font-sans font-bold text-gray-800 text-lg">
                    답변{" "}
                    <Text className="font-sans text-orange-500">
                      {answers.length}
                    </Text>
                  </Text>
                </View>

                {answers.length === 0 ? (
                  <View className="py-10 items-center">
                    <Text className="font-sans text-gray-400">
                      아직 작성된 답변이 없습니다.
                    </Text>
                  </View>
                ) : (
                  answers.map((answer) => {
                    const isMyAnswer = currentUserId === answer.memberId;
                    return (
                      <FeedCard
                        key={answer.id || answer.answerId}
                        answer={answer}
                        isMyAnswer={isMyAnswer}
                        onEdit={() => handleEditAnswer(answer)}
                        onDelete={() => handleDeleteAnswer(answer)}
                        onReaction={(type) => handleReaction(answer, type)}
                      />
                    );
                  })
                )}
              </>
            )}
          </View>

          {/* 댓글 목록 */}
          {!loading && (
            <View className="mt-4 mb-5">
              <View className="py-2 mb-2">
                <Text className="font-sans font-bold text-gray-800 text-lg">
                  댓글{" "}
                  <Text className="font-sans text-gray-500">
                    {comments.length}
                  </Text>
                </Text>
              </View>

              <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {comments.length === 0 ? (
                  <View className="py-8 items-center bg-white">
                    <Text className="font-sans text-gray-400 text-sm">
                      첫 번째 댓글을 남겨보세요!
                    </Text>
                  </View>
                ) : (
                  renderComments()
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* 댓글 입력창 (Static Bottom) */}
        <View className="px-5 pb-8 pt-2 bg-transparent">
          <View className="bg-white rounded-2xl px-2 py-2 shadow-lg border border-orange-100">
            {replyingToComment && (
              <View className="flex-row items-center justify-between bg-orange-50 px-3 py-2 rounded-lg mb-2">
                <Text className="font-sans text-xs text-gray-600">
                  <Text className="font-sans font-bold">
                    {
                      getRoleIconAndText(
                        replyingToComment.member?.familyRole,
                        replyingToComment.member?.gender
                      ).text
                    }
                  </Text>
                  님에게 답글 작성 중...
                </Text>
                <TouchableOpacity onPress={() => setReplyingToComment(null)}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            )}
            <View className="flex-row items-end gap-2">
              <TextInput
                className="flex-1 bg-transparent px-2 py-2 font-sans text-base text-gray-900 max-h-24"
                placeholder="댓글을 입력하세요..."
                placeholderTextColor="#6B7280"
                multiline
                value={newCommentText}
                onChangeText={setNewCommentText}
              />
              <TouchableOpacity
                className={`w-10 h-10 rounded-full items-center justify-center mb-0.5 ${
                  newCommentText.trim() ? "bg-orange-500" : "bg-gray-200"
                }`}
                disabled={!newCommentText.trim()}
                onPress={handleCreateComment}
              >
                <Ionicons name="arrow-up" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 답변 수정 모달 */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 bg-black/40 items-center justify-center p-5">
          <View className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <Text className="font-sans text-lg font-bold text-gray-900 mb-4">
              답변 수정
            </Text>
            <TextInput
              className="bg-gray-50 rounded-xl p-4 font-sans text-base text-gray-900 min-h-[120px]"
              multiline
              value={editText}
              onChangeText={setEditText}
              placeholder="내용을 입력하세요"
              textAlignVertical="top"
            />
            <View className="flex-row justify-end gap-3 mt-6">
              <TouchableOpacity
                className="px-5 py-2.5 rounded-lg bg-gray-100"
                onPress={() => setShowEditModal(false)}
              >
                <Text className="font-sans text-gray-600 font-medium">
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-5 py-2.5 rounded-lg bg-orange-500"
                onPress={handleSaveEdit}
              >
                <Text className="font-sans text-white font-medium">저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 댓글 수정 모달 */}
      <Modal
        visible={showEditCommentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditCommentModal(false)}
      >
        <View className="flex-1 bg-black/40 items-center justify-center p-5">
          <View className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <Text className="font-sans text-lg font-bold text-gray-900 mb-4">
              댓글 수정
            </Text>
            <TextInput
              className="bg-gray-50 rounded-xl p-4 font-sans text-base text-gray-900 min-h-[100px]"
              multiline
              value={editCommentText}
              onChangeText={setEditCommentText}
              placeholder="내용을 입력하세요"
              textAlignVertical="top"
            />
            <View className="flex-row justify-end gap-3 mt-6">
              <TouchableOpacity
                className="px-5 py-2.5 rounded-lg bg-gray-100"
                onPress={() => setShowEditCommentModal(false)}
              >
                <Text className="font-sans text-gray-600 font-medium">
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-5 py-2.5 rounded-lg bg-orange-500"
                onPress={handleSaveCommentEdit}
              >
                <Text className="font-sans text-white font-medium">저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}