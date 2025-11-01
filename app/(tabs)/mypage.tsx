import ActivitySection from "@/components/mypage/ActivitySection";
import LogoutButton from "@/components/mypage/LogoutButton";
import ProfileSection from "@/components/mypage/ProfileSection";
import SettingsSection from "@/components/mypage/SettingsSection";
import { deleteMember, getMyPage, MypageResponse, patchMyPage, setAccessToken } from "@/utils/api";
import { getItem, removeItem } from "@/utils/AsyncStorage";
import { familyRoleToKo, genderToKo, roleToKo } from "@/utils/labels";
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
    avatarUri: data?.profileImageUrl || "https://via.placeholder.com/150",
    onEditPress: onEditProfile,
  };

  const stats = {
    totalAnswers: 0,
    reactionsReceived: 0,
    consecutiveDays: 0,
    familyRank: 0,
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-5">
          <View className="gap-5">
            <ProfileSection {...profileProps} />

            <View className="bg-white w-full p-6 rounded-2xl shadow-sm gap-2">
              <Text className="text-lg font-bold text-gray-800 mb-1">내 정보</Text>
              <Text className="text-sm text-gray-700">역할: {roleToKo(data?.role)}</Text>
              <Text className="text-sm text-gray-700">가족 내 역할: {familyRoleToKo(data?.familyRole)}</Text>
              <Text className="text-sm text-gray-700">생년월일: {data?.birthDate ?? "-"}</Text>
              <Text className="text-sm text-gray-700">성별: {genderToKo(data?.gender)}</Text>
              <Text className="text-sm text-gray-700">알림: {data?.alarmEnabled ? "켜짐" : "꺼짐"}</Text>
            </View>

            <ActivitySection stats={stats} />

            <View className="bg-white w-full p-4 rounded-2xl shadow-sm gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-800">알림</Text>
                <TouchableOpacity
                  onPress={toggleAlarm}
                  disabled={updating}
                  className={`px-3 py-2 rounded-lg ${
                    data?.alarmEnabled ? "bg-orange-100" : "bg-gray-100"
                  }`}
                >
                  <Text className={`text-sm ${data?.alarmEnabled ? "text-orange-600" : "text-gray-600"}`}>
                    {updating ? "처리 중..." : data?.alarmEnabled ? "켜짐" : "꺼짐"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-800">가족 초대코드</Text>
                <Text className="text-gray-700">{data?.familyInvitationCode || "-"}</Text>
              </View>
              <TouchableOpacity
                onPress={regenerateInvitation}
                disabled={updating}
                className="self-end px-3 py-2 rounded-lg bg-orange-100"
              >
                <Text className="text-orange-600">초대코드 재발급</Text>
              </TouchableOpacity>
            </View>
            <SettingsSection />
            <LogoutButton />
            <View className="bg-white w-full p-4 rounded-2xl shadow-sm">
              <TouchableOpacity onPress={onDeleteAccount} className="items-center">
                <Text className="text-red-500">{deleting ? "탈퇴 처리 중..." : "회원 탈퇴"}</Text>
              </TouchableOpacity>
            </View>
            {error ? (
              <Text className="text-red-500 text-sm text-center">{error}</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
