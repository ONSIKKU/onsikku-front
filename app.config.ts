// app.config.ts
import "dotenv/config";
import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "family-front",
  slug: "family-front",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "onsikku", // 우리 앱 커스텀 스킴
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.jebiyeon.familyfront",
    infoPlist: {
      // ✅ 카카오 네이티브 스킴 + 우리 앱 스킴 등록
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
            `kakao${process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY}`,
          ],
        },
        {
          CFBundleURLSchemes: ["onsikku"],
        },
      ],
      // ✅ 카카오톡/링크 스킴 조회 허용
      LSApplicationQueriesSchemes: [
        "kakaokompassauth",
        "kakaolink",
        "kakaotalk",
      ],
    },
  },

  android: {
    package: "com.jebiyeon.familyfront",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,

    // (선택) 딥링크 인텐트 필터 — 카카오 SDK 플러그인이 보통 처리하지만 명시적으로 둬도 OK
    intentFilters: [
      {
        action: "VIEW",
        data: [
          {
            scheme: `kakao${process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY}`,
            host: "oauth",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
      {
        action: "VIEW",
        data: [{ scheme: "onsikku" }],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
    // 카카오톡 앱 쿼리 허용
    // queries: [
    //   { package: "com.kakao.talk" },
    //   { scheme: "kakaokompassauth" },
    //   { scheme: "kakaolink" },
    // ],
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-font",
    // ✅ 카카오 로그인 플러그인 (환경변수 주입 가능)
    [
      "@react-native-seoul/kakao-login",
      {
        kakaoAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY,
        kotlinVersion: "2.0.21",
      },
    ],
    // 카카오 저장소 추가 (안드로이드)
    [
      "expo-build-properties",
      {
        android: {
          extraMavenRepos: [
            "https://devrepo.kakao.com/nexus/content/groups/public/",
          ],
        },
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
  },
};

export default config;
