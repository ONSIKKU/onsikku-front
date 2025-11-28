import { Answer, Comment, createComment, deleteAnswer, deleteComment, getMyPage, getQuestionInstanceDetails, setAccessToken, updateAnswer, updateComment } from "@/utils/api";
import { getItem } from "@/utils/AsyncStorage";
import { familyRoleToKo } from "@/utils/labels";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

// Instagram 스타일 피드 카드
const FeedCard = ({ 
  answer, 
  commentCount,
  isMyAnswer,
  onEdit,
  onDelete,
}: { 
  answer: Answer;
  commentCount: number;
  isMyAnswer: boolean;
  onEdit: () => void;
  onDelete: () => void;
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
      {/* 헤더: 프로필 이미지 + 이름 + 시간 + 하트/수정삭제 */}
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
        {isMyAnswer ? (
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={onEdit}>
              <Ionicons name="create-outline" size={22} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>
        )}
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
const CommentCard = ({ 
  comment, 
  isMyComment,
  onEdit,
  onDelete,
  onReply,
}: { 
  comment: Comment;
  isMyComment: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReply: () => void;
}) => {
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
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-semibold text-gray-900">{roleName}</Text>
              <Text className="text-xs text-gray-500">{timeAgo}</Text>
            </View>
            {isMyComment && (
              <View className="flex-row items-center gap-2">
                <TouchableOpacity onPress={onEdit}>
                  <Ionicons name="create-outline" size={16} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete}>
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text className="text-sm text-gray-800 leading-5 mb-2">{comment.content}</Text>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity className="flex-row items-center gap-1">
              <Ionicons name="heart-outline" size={16} color="#000" />
              <Text className="text-xs text-gray-500">0</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onReply}>
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [questionAssignments, setQuestionAssignments] = useState<any[]>([]);
  const [editingAnswer, setEditingAnswer] = useState<Answer | null>(null);
  const [editText, setEditText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [showEditCommentModal, setShowEditCommentModal] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [replyingToComment, setReplyingToComment] = useState<Comment | null>(null);

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

        // 현재 사용자 정보 가져오기
        try {
          const myPage = await getMyPage();
          setCurrentUserId(myPage.memberId || null);
        } catch (e) {
          console.error("[사용자 정보 조회 에러]", e);
        }

        // 질문 인스턴스 상세 조회 (답변 + 댓글 포함)
        const questionData = await getQuestionInstanceDetails(questionInstanceId);
        
        // 질문 내용
        const content = questionData.questionDetails?.questionContent || question;
        setQuestionContent(content);

        // 질문 할당 정보 저장 (questionAssignmentId 찾기 위해)
        const assignments = questionData.questionDetails?.questionAssignments || [];
        setQuestionAssignments(assignments);

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

  // 답변 작성자의 questionAssignmentId 찾기
  const getQuestionAssignmentIdForAnswer = (answer: Answer): string | null => {
    // 답변 작성자의 memberId로 questionAssignment 찾기
    const assignment = questionAssignments.find(
      (qa) => qa.member?.id === answer.memberId
    );
    return assignment?.id || null;
  };

  // 답변 수정 핸들러
  const handleEditAnswer = (answer: Answer) => {
    const contentText =
      typeof answer.content === "string"
        ? answer.content
        : answer.content?.text || "";
    setEditingAnswer(answer);
    setEditText(contentText);
    setShowEditModal(true);
  };

  // 답변 수정 저장
  const handleSaveEdit = async () => {
    if (!editingAnswer || !editText.trim()) {
      Alert.alert("확인", "답변 내용을 입력해주세요.");
      return;
    }

    try {
      const questionAssignmentId = getQuestionAssignmentIdForAnswer(editingAnswer);
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

      // 답변 목록 새로고침
      const questionData = await getQuestionInstanceDetails(questionInstanceId!);
      const answerList = questionData.questionDetails?.answers || [];
      const convertedAnswers: Answer[] = answerList.map((ans: any) => ({
        ...ans,
        id: ans.answerId,
      }));
      setAnswers(convertedAnswers);

      // 댓글 목록도 새로고침
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

  // 답변 삭제 핸들러
  const handleDeleteAnswer = (answer: Answer) => {
    Alert.alert(
      "답변 삭제",
      "정말 이 답변을 삭제하시겠어요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              const questionAssignmentId = getQuestionAssignmentIdForAnswer(answer);
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

              // 답변 목록 새로고침
              const questionData = await getQuestionInstanceDetails(questionInstanceId!);
              const answerList = questionData.questionDetails?.answers || [];
              const convertedAnswers: Answer[] = answerList.map((ans: any) => ({
                ...ans,
                id: ans.answerId,
              }));
              setAnswers(convertedAnswers);

              // 댓글 목록도 새로고침
              const commentList = questionData.questionDetails?.comments || [];
              setComments(commentList as Comment[]);

              Alert.alert("완료", "답변이 삭제되었습니다.");
            } catch (e: any) {
              console.error("[답변 삭제 에러]", e);
              Alert.alert("오류", e?.message || "답변 삭제에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  // 댓글 생성 핸들러
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

      // 댓글 목록 새로고침
      const questionData = await getQuestionInstanceDetails(questionInstanceId);
      const commentList = questionData.questionDetails?.comments || [];
      setComments(commentList as Comment[]);

      setNewCommentText("");
      setShowCommentInput(false);
      setReplyingToComment(null);
    } catch (e: any) {
      console.error("[댓글 생성 에러]", e);
      Alert.alert("오류", e?.message || "댓글 작성에 실패했습니다.");
    }
  };

  // 댓글 수정 핸들러
  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditCommentText(comment.content);
    setShowEditCommentModal(true);
  };

  // 댓글 수정 저장
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

      // 댓글 목록 새로고침
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

  // 댓글 삭제 핸들러
  const handleDeleteComment = (comment: Comment) => {
    Alert.alert(
      "댓글 삭제",
      "정말 이 댓글을 삭제하시겠어요?",
      [
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

              // 댓글 목록 새로고침
              const questionData = await getQuestionInstanceDetails(questionInstanceId!);
              const commentList = questionData.questionDetails?.comments || [];
              setComments(commentList as Comment[]);

              Alert.alert("완료", "댓글이 삭제되었습니다.");
            } catch (e: any) {
              console.error("[댓글 삭제 에러]", e);
              Alert.alert("오류", e?.message || "댓글 삭제에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  // 댓글 답글 작성 핸들러
  const handleReplyComment = (comment: Comment) => {
    setReplyingToComment(comment);
    setShowCommentInput(true);
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
              {answers.map((answer) => {
                const isMyAnswer = currentUserId === answer.memberId;
                return (
                  <View key={answer.id || answer.answerId} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <FeedCard
                      answer={answer}
                      commentCount={getCommentCountForAnswer(answer.answerId || answer.id || "")}
                      isMyAnswer={isMyAnswer}
                      onEdit={() => handleEditAnswer(answer)}
                      onDelete={() => handleDeleteAnswer(answer)}
                    />
                  </View>
                );
              })}

              {/* 댓글 섹션 */}
              <View className="px-2">
                <Text className="text-sm font-semibold text-gray-900">
                  대댓글 {comments.length}개
                </Text>
              </View>
              
              {/* 댓글 입력 */}
              <View className="bg-white rounded-2xl shadow-sm p-4">
                {replyingToComment && (
                  <View className="bg-orange-50 p-2 rounded-lg mb-3">
                    <Text className="text-xs text-gray-600">
                      {familyRoleToKo(replyingToComment.member?.familyRole || "PARENT")}님에게 답글
                    </Text>
                  </View>
                )}
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base text-gray-900 min-h-[80px]"
                  multiline
                  numberOfLines={4}
                  value={newCommentText}
                  onChangeText={setNewCommentText}
                  placeholder="댓글을 입력해주세요"
                  textAlignVertical="top"
                  maxLength={500}
                />
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-xs text-gray-500">
                    {newCommentText.length}/500
                  </Text>
                  <View className="flex-row gap-2">
                    {(showCommentInput || replyingToComment) && (
                      <TouchableOpacity
                        className="px-4 py-2 bg-gray-200 rounded-lg"
                        onPress={() => {
                          setShowCommentInput(false);
                          setReplyingToComment(null);
                          setNewCommentText("");
                        }}
                      >
                        <Text className="text-sm font-semibold text-gray-700">취소</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      className="px-4 py-2 bg-orange-500 rounded-lg"
                      onPress={handleCreateComment}
                    >
                      <Text className="text-sm font-semibold text-white">작성</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* 댓글 목록 */}
              {comments.length > 0 && (
                <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {comments.map((comment) => {
                    const isMyComment = currentUserId === comment.member?.id;
                    return (
                      <CommentCard
                        key={comment.id}
                        comment={comment}
                        isMyComment={isMyComment}
                        onEdit={() => handleEditComment(comment)}
                        onDelete={() => handleDeleteComment(comment)}
                        onReply={() => handleReplyComment(comment)}
                      />
                    );
                  })}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* 답변 수정 모달 */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowEditModal(false);
          setEditingAnswer(null);
          setEditText("");
        }}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-5">
          <View className="bg-white rounded-2xl w-full max-w-md p-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">답변 수정</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-base text-gray-900 min-h-[120px]"
              multiline
              numberOfLines={6}
              value={editText}
              onChangeText={setEditText}
              placeholder="답변을 입력해주세요"
              textAlignVertical="top"
              maxLength={500}
            />
            <Text className="text-xs text-gray-500 mt-2 text-right">
              {editText.length}/500
            </Text>
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                onPress={() => {
                  setShowEditModal(false);
                  setEditingAnswer(null);
                  setEditText("");
                }}
              >
                <Text className="text-base font-semibold text-gray-700">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-orange-500 rounded-lg py-3 items-center"
                onPress={handleSaveEdit}
              >
                <Text className="text-base font-semibold text-white">저장</Text>
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
        onRequestClose={() => {
          setShowEditCommentModal(false);
          setEditingComment(null);
          setEditCommentText("");
        }}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-5">
          <View className="bg-white rounded-2xl w-full max-w-md p-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">댓글 수정</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-base text-gray-900 min-h-[100px]"
              multiline
              numberOfLines={5}
              value={editCommentText}
              onChangeText={setEditCommentText}
              placeholder="댓글을 입력해주세요"
              textAlignVertical="top"
              maxLength={500}
            />
            <Text className="text-xs text-gray-500 mt-2 text-right">
              {editCommentText.length}/500
            </Text>
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                onPress={() => {
                  setShowEditCommentModal(false);
                  setEditingComment(null);
                  setEditCommentText("");
                }}
              >
                <Text className="text-base font-semibold text-gray-700">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-orange-500 rounded-lg py-3 items-center"
                onPress={handleSaveCommentEdit}
              >
                <Text className="text-base font-semibold text-white">저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
