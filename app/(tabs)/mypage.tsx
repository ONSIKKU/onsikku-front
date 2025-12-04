import LogoutButton from "@/components/mypage/LogoutButton";
import ProfileSection from "@/components/mypage/ProfileSection";
import { useSignupStore } from "@/features/signup/signupStore";
import {
  deleteMember,
  getMyPage,
  logout,
  MypageResponse,
  patchMyPage,
  setAccessToken,
} from "@/utils/api";
import { getItem, removeItem } from "@/utils/AsyncStorage";
import { genderToKo, getRoleIconAndText } from "@/utils/labels";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  const calculateAge = (birthDateString: string | undefined): number | null => {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const toggleAlarm = async () => {
    if (!data?.member) return;
    try {
      setUpdating(true);
      const next = !data.member.alarmEnabled;
      const res = await patchMyPage({ isAlarmEnabled: next });
      setData(res);
    } catch (e: any) {
      setError(e?.message || "알림 설정 변경에 실패했습니다");
    } finally {
      setUpdating(false);
    }
  };

  const regenerateInvitation = async () => {
    if (!data?.family) return;
    try {
      setUpdating(true);
      const isCurrentlyEnabled = data.family.familyInviteEnabled;

      // If currently enabled, toggle to false first to ensure a 'change' for the API
      if (isCurrentlyEnabled) {
        await patchMyPage({ isFamilyInviteEnabled: false });
        // The API response from this call will update `data` state, which is fine.
        // We don't need to specifically use `setData` here as the subsequent call will update it again.
      }

      // Then set to true to trigger regeneration
      const res = await patchMyPage({ isFamilyInviteEnabled: true });
      setData(res);
      Alert.alert("재발급 완료", `초대코드가 재발급되었습니다.`);
    } catch (e: any) {
      Alert.alert("오류", e?.message || "초대코드 재발급에 실패했습니다");
    } finally {
      setUpdating(false);
    }
  };

  const copyInvitationCode = async () => {
    if (data?.family?.invitationCode) {
      await Clipboard.setStringAsync(data.family.invitationCode);
      Alert.alert("복사 완료", "초대코드가 클립보드에 복사되었습니다.");
    } else {
      Alert.alert("알림", "초대코드가 없습니다.");
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
            useSignupStore.getState().reset();
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
    Alert.alert("회원 탈퇴", "정말 탈퇴하시겠습니까?", [
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
            useSignupStore.getState().reset();
            router.replace("/");
          } catch (e: any) {
            Alert.alert("오류", e?.message || "회원 탈퇴에 실패했습니다");
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
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
    avatarUri: data?.member?.profileImageUrl || "",
    familyRole: data?.member?.familyRole,
    gender: data?.member?.gender,
  };

  return (
    <SafeAreaView className="flex-1 bg-onsikku-main-orange" edges={["top"]}>
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
                  <Text className="text-sm font-medium text-orange-600 ml-1">
                    수정
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="gap-3">
                <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Ionicons name="home-outline" size={20} color="#FB923C" />
                    <Text className="text-sm text-gray-600 ml-2">가족명</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-800">
                    {data?.family?.familyName}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Ionicons name="people-outline" size={20} color="#FB923C" />
                    <Text className="text-sm text-gray-600 ml-2">
                      가족 내 역할
                    </Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-800">
                    {
                      getRoleIconAndText(
                        data?.member?.familyRole,
                        data?.member?.gender
                      ).text
                    }
                  </Text>
                </View>
                <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#FB923C"
                    />
                    <Text className="text-sm text-gray-600 ml-2">생년월일</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-800">
                    {data?.member?.birthDate ?? "-"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="male-female-outline"
                      size={20}
                      color="#FB923C"
                    />
                    <Text className="text-sm text-gray-600 ml-2">성별</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-800">
                    {genderToKo(data?.member?.gender)}
                  </Text>
                </View>
              </View>
            </View>

            {/* 함께하는 가족 */}
            <View className="bg-white w-full p-5 rounded-3xl shadow-sm">
              <Text className="text-lg font-bold text-gray-800 mb-4">
                함께하는 가족
              </Text>
              <View className="gap-3">
                {data?.familyMembers?.map((member, index) => (
                  <View
                    key={member.id}
                    className={`flex-row items-center justify-between py-2 ${
                      index !== (data.familyMembers?.length ?? 0) - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <View className="flex-row items-center">
                      <Ionicons
                        name="person-circle-outline"
                        size={24}
                        color="#FB923C"
                      />
                      <Text className="text-sm text-gray-600 ml-2">
                        {
                          getRoleIconAndText(member.familyRole, member.gender)
                            .text
                        }{" "}
                        ({calculateAge(member.birthDate)}세)
                      </Text>
                      {member.id === data?.member?.id && (
                        <Text className="text-xs font-bold text-orange-500 ml-1">
                          (나)
                        </Text>
                      )}
                    </View>
                    <Text className="text-sm font-medium text-gray-800">
                      {/* 이름이 따로 없으므로 역할로 대체하거나 추후 추가 */}
                      {member.familyRole === "GRANDPARENT"
                        ? "조부모님"
                        : member.familyRole === "PARENT"
                        ? "부모님"
                        : "자녀"}
                    </Text>
                  </View>
                ))}
                {(!data?.familyMembers || data.familyMembers.length === 0) && (
                  <Text className="text-gray-400 text-center py-4">
                    아직 가족 구성원이 없습니다.
                  </Text>
                )}
              </View>
            </View>

            {/* 설정 카드 */}
            <View className="bg-white w-full p-5 rounded-3xl shadow-sm">
              <Text className="text-lg font-bold text-gray-800 mb-4">설정</Text>
              <View className="gap-3">
                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center flex-1">
                    <Ionicons
                      name="notifications-outline"
                      size={20}
                      color="#FB923C"
                    />
                    <Text className="text-sm text-gray-800 ml-2">알림</Text>
                  </View>
                  <Pressable
                    onPress={toggleAlarm}
                    disabled={updating}
                    className={`px-4 py-2 rounded-full ${
                      data?.member?.alarmEnabled
                        ? "bg-orange-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        data?.member?.alarmEnabled
                          ? "text-orange-600"
                          : "text-gray-600"
                      }`}
                    >
                      {updating
                        ? "처리 중..."
                        : data?.member?.alarmEnabled
                        ? "켜짐"
                        : "꺼짐"}
                    </Text>
                  </Pressable>
                </View>
                <View className="flex-row items-center justify-between py-2 border-t border-gray-100 pt-3">
                  <View className="flex-row items-center flex-1">
                    <Ionicons name="key-outline" size={20} color="#FB923C" />
                    <View className="ml-2">
                      <Text className="text-sm text-gray-800">
                        가족 초대코드
                      </Text>
                      <Text className="text-xs text-gray-500 mt-0.5 font-mono">
                        {data?.family?.invitationCode || "-"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={copyInvitationCode}
                      className="px-3 py-2 rounded-lg bg-orange-50"
                    >
                      <Ionicons name="copy-outline" size={16} color="#FB923C" />
                    </Pressable>
                    <Pressable
                      onPress={regenerateInvitation}
                      disabled={updating}
                      className="px-3 py-2 rounded-lg bg-orange-50"
                    >
                      <Ionicons name="refresh" size={16} color="#FB923C" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

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
