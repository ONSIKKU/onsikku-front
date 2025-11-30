import LandingScreen from "@/screens/LandingScreen";
import { getItem } from "@/utils/AsyncStorage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getItem("accessToken");
        if (token) {
          // 토큰이 있으면 메인 화면으로 이동
          router.replace("/(tabs)/home");
        } else {
          // 토큰이 없으면 랜딩 화면 표시
          setLoading(false);
        }
      } catch (e) {
        console.error("Authentication check failed", e); // 에러 로깅 추가
        setLoading(false); // 에러 발생 시에도 랜딩 화면 표시
      } finally {
        // 여기서는 setLoading(false)를 호출하지 않습니다.
        // 토큰이 있을 경우 router.replace로 이동하고, 없을 경우 또는 에러 시 catch/else 블록에서 처리됩니다.
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FB923C" />
      </View>
    );
  }

  return <LandingScreen />;
}
