import ActivitySection from "@/components/mypage/ActivitySection";
import LogoutButton from "@/components/mypage/LogoutButton";
import ProfileSection from "@/components/mypage/ProfileSection";
import SettingsSection from "@/components/mypage/SettingsSection";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data - will be replaced with real data from API
const userProfile = {
  name: "김아빠",
  email: "dad@family.com",
  familyName: "김씨네 가족",
  joinDate: "2024.01.15",
  avatarUri: "https://via.placeholder.com/150", // Replace with actual avatar
};

const userActivities = {
  totalAnswers: 45,
  reactionsReceived: 128,
  consecutiveDays: 7,
  familyRank: 2,
};

export default function Page() {
  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-5">
          <View className="gap-5">
            <ProfileSection {...userProfile} />
            <ActivitySection stats={userActivities} />
            <SettingsSection />
            <LogoutButton />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
