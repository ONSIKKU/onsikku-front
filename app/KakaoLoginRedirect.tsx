// app/KakaoLoginRedirect.tsx

import { setItem } from "@/utils/AsyncStorage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

// .env에 EXPO_PUBLIC_API_BASE 넣어두는 걸 추천 (예: https://api.example.com)
const API_BASE = process.env.EXPO_PUBLIC_API_BASE!;

export default function KakaoLoginRedirect() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!code || typeof code !== "string") {
          throw new Error("인가 코드가 없습니다.");
        }
        // console.log("code :", code);
        // 1) 백엔드로 code 전달
        const res = await fetch(`${API_BASE}/api/auth/kakao`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`로그인 실패(${res.status}) ${txt}`);
        }

        // 2) 응답 파싱 (스웨거 스샷 기준)
        // { code, message, result: { accessToken, registrationToken, registered } }
        const json = await res.json();
        const result = json?.result ?? json; // 혹시 래핑 안 된 경우 대비
        const { accessToken, registrationToken, registered } = result;
        setItem("registrationToken", registrationToken); // AsyncStorage에 저장
        setItem("accessToken", accessToken); // AsyncStorage에 저장
        console.log(result);

        // 3) 토큰 저장(필요 시)
        // if (accessToken) {
        //   await SecureStore.setItemAsync("accessToken", accessToken);
        // }

        // 4) 라우팅 분기
        if (registered) {
          router.replace("/signup/role"); // 홈 라우트에 맞춰 변경
        } else {
          // 회원가입 플로우로. 필요한 파라미터 같이 전달
          router.replace({
            pathname: "/signup/role",
            params: { registrationToken },
          });
        }
      } catch (e: any) {
        console.log(e);
        Alert.alert("로그인 오류", e?.message ?? "다시 시도해주세요.");
        router.replace("/"); // 처음 화면으로 복귀
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
      <Text className="mt-4">카카오 로그인 처리 중...</Text>
    </View>
  );
}
