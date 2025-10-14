import NotificationList from "@/components/notification/NotificationList";
import NotificationSummary from "@/components/notification/NotificationSummary";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationScreen() {
  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView>
        <View className="gap-5 px-5 pb-10">
          <NotificationSummary />
          <NotificationList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
