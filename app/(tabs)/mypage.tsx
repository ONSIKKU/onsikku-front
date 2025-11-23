import ActivitySection from "@/components/mypage/ActivitySection";
import LogoutButton from "@/components/mypage/LogoutButton";
import ProfileSection from "@/components/mypage/ProfileSection";
import SettingsSection from "@/components/mypage/SettingsSection";
import { deleteMember, getMyPage, logout, MypageResponse, patchMyPage, setAccessToken } from "@/utils/api";
import { getItem, removeItem } from "@/utils/AsyncStorage";
import { familyRoleToKo, genderToKo, roleToKo } from "@/utils/labels";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const [data, setData] = useState<MypageResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const fetchMyPage = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = await getItem("accessToken");
      console.log("[액세스 토큰]", token || "토큰 없음");
      if (token) {
        setAccessToken(token);
        setHasToken(true);
        const res = await getMyPage();
        setData(res);
      } else {
        setHasToken(false);
        setData(null);
      }
    } catch (e: any) {
      setError(e?.message || "마이페이지를 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyPage();
  }, [fetchMyPage]);

  useFocusEffect(
    useCallback(() => {
      fetchMyPage();
    }, [fetchMyPage])
  );

  const toggleAlarm = async () => {
    if (!data) return;
    try {
      setUpdating(true);
      const next = !data.alarmEnabled;
      const res = await patchMyPage({ isAlarmEnabled: next });
      setData(res);
    } catch (e: any) {
      setError(e?.message || "알림 설정 변경에 실패했습니다");
    } finally {
      setUpdating(false);
    }
  };

  const regenerateInvitation = async () => {
    try {
      setUpdating(true);
      const res = await patchMyPage({ regenerateFamilyInvitationCode: true });
      setData(res);
      Alert.alert("재발급 완료", `초대코드가 재발급되었습니다.`);
    } catch (e: any) {
      Alert.alert("오류", e?.message || "초대코드 재발급에 실패했습니다");
    } finally {
      setUpdating(false);
    }
  };

  const onEditProfile = () => {
    router.push("/mypage-edit");
  };

  const onLogout = async () => {
    Alert.alert("로그아웃", "로그아웃 하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        onPress: async () => {
          try {
            setUpdating(true);
            await logout();
            await removeItem("accessToken");
            await removeItem("registrationToken");
            setAccessToken(null);
            router.replace("/");
          } catch (e: any) {
            console.error("[로그아웃 에러]", e);
            Alert.alert("오류", e?.message || "로그아웃에 실패했습니다");
          } finally {
            setUpdating(false);
          }
        },
      },
    ]);
  };

  const onDeleteAccount = () => {
    Alert.alert(
      "회원 탈퇴",
      "회원 탈퇴를 진행하시겠어요? 답변은 soft delete, 기타 데이터는 삭제됩니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: deleting ? "진행중" : "탈퇴",
          style: "destructive",
          onPress: async () => {
            if (deleting) return;
            try {
              setDeleting(true);
              await deleteMember();
              await removeItem("accessToken");
              await removeItem("registrationToken");
              router.replace("/");
            } catch (e: any) {
              Alert.alert("오류", e?.message || "회원 탈퇴에 실패했습니다");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-orange-50 items-center justify-center">
        <Text className="text-gray-600">불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (!hasToken) {
    return (
      <SafeAreaView className="flex-1 bg-orange-50 items-center justify-center">
        <Text className="text-gray-700 mb-4">로그인이 필요합니다</Text>
        <TouchableOpacity
          className="px-4 py-2 rounded-lg bg-orange-100"
          onPress={() => router.push("/KakaoLoginWebView")}
        >
          <Text className="text-orange-600">카카오로 로그인</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaView className="flex-1 bg-orange-50 items-center justify-center">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity
          className="mt-3 px-4 py-2 rounded-lg bg-orange-100"
          onPress={() => router.push("/KakaoLoginWebView")}
        >
          <Text className="text-orange-600">다시 로그인</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const profileProps = {
    name: data?.familyName || "온식구",
    email: "",
    familyName: data?.familyName || "",
    joinDate: "",
    avatarUri: data?.profileImageUrl || "",
    onEditPress: onEditProfile,
  };

  const stats = {
    totalAnswers: 0,
    reactionsReceived: 0,
    consecutiveDays: 0,
    familyRank: 0,
  };

  return (
    <SafeAreaView className="flex-1 bg-onsikku-main-orange">
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4">
          <View className="gap-4">
            <ProfileSection {...profileProps} />

            {/* 내 정보 카드 */}
            <View className="bg-white w-full p-5 rounded-3xl shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-800">내 정보</Text>
                <TouchableOpacity
                  onPress={onEditProfile}
                  className="flex-row items-center px-3 py-1.5 bg-orange-50 rounded-lg"
                >
                  <Ionicons name="create-outline" size={16} color="#FB923C" />
                  <Text className="text-sm font-medium text-orange-600 ml-1">수정</Text>
                </TouchableOpacity>
              </View>
              <View className="gap-3">
                <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Ionicons name="person-circle-outline" size={20} color="#FB923C" />
                    <Text className="text-sm text-gray-600 ml-2">역할</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-800">{roleToKo(data?.role)}</Text>
                </View>
                <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Ionicons name="people-outline" size={20} color="#FB923C" />
                    <Text className="text-sm text-gray-600 ml-2">가족 내 역할</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-800">{familyRoleToKo(data?.familyRole)}</Text>
                </View>
                <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={20} color="#FB923C" />
                    <Text className="text-sm text-gray-600 ml-2">생년월일</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-800">{data?.birthDate ?? "-"}</Text>
                </View>
                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center">
                    <Ionicons name="person-outline" size={20} color="#FB923C" />
                    <Text className="text-sm text-gray-600 ml-2">성별</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-800">{genderToKo(data?.gender)}</Text>
                </View>
              </View>
            </View>

            <ActivitySection stats={stats} />

            {/* 설정 카드 */}
            <View className="bg-white w-full p-5 rounded-3xl shadow-sm">
              <Text className="text-lg font-bold text-gray-800 mb-4">설정</Text>
              <View className="gap-3">
                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center flex-1">
                    <Ionicons name="notifications-outline" size={20} color="#FB923C" />
                    <Text className="text-sm text-gray-800 ml-2">알림</Text>
                  </View>
                  <TouchableOpacity
                    onPress={toggleAlarm}
                    disabled={updating}
                    className={`px-4 py-2 rounded-full ${
                      data?.alarmEnabled ? "bg-orange-100" : "bg-gray-100"
                    }`}
                  >
                    <Text className={`text-xs font-medium ${data?.alarmEnabled ? "text-orange-600" : "text-gray-600"}`}>
                      {updating ? "처리 중..." : data?.alarmEnabled ? "켜짐" : "꺼짐"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center justify-between py-2 border-t border-gray-100 pt-3">
                  <View className="flex-row items-center flex-1">
                    <Ionicons name="key-outline" size={20} color="#FB923C" />
                    <View className="ml-2">
                      <Text className="text-sm text-gray-800">가족 초대코드</Text>
                      <Text className="text-xs text-gray-500 mt-0.5 font-mono">{data?.familyInvitationCode || "-"}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={regenerateInvitation}
                    disabled={updating}
                    className="px-3 py-2 rounded-lg bg-orange-50"
                  >
                    <Ionicons name="refresh" size={16} color="#FB923C" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <SettingsSection />
            
            <LogoutButton onPress={onLogout} />
            
            <TouchableOpacity 
              onPress={onDeleteAccount} 
              className="bg-white w-full p-4 rounded-3xl shadow-sm items-center"
            >
              <Text className="text-red-500 font-medium">
                {deleting ? "탈퇴 처리 중..." : "회원 탈퇴"}
              </Text>
            </TouchableOpacity>
            
            {error ? (
              <Text className="text-red-500 text-sm text-center">{error}</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
