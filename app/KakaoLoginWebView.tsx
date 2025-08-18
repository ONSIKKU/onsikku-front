// app/KakaoLoginWebView.tsx
import { router } from "expo-router";
import { View } from "react-native";
import { WebView } from "react-native-webview";
const API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY!;
const REDIRECT_URI = process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI!;
const KAUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`; // 실제 파라미터 채우기

export default function KakaoLoginWebView() {
  return (
    <View className="flex-1">
      <WebView
        source={{ uri: KAUTH_URL }}
        onShouldStartLoadWithRequest={(req) => {
          // 리다이렉트에 code가 붙었는지 검사
          const m = req.url.match(/[?&]code=([^&]+)/);
          if (m) {
            const code = decodeURIComponent(m[1]);
            router.replace({
              pathname: "/KakaoLoginRedirect",
              params: { code },
            });
            return false; // WebView로 열지 않고 앱 라우트로 이동
          }
          return true;
        }}
      />
    </View>
  );
}
