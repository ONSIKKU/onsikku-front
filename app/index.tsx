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
      } else {
        // 토큰이 없으면 랜딩 페이지 유지 (아무것도 하지 않음)
      }
    } catch (e) {
      // ignore error
    } finally {
      setLoading(false);
    }
  };
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
