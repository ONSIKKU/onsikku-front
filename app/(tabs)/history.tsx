import ActivitySummary from "@/components/history/ActivitySummary";
import DateSelector from "@/components/history/DateSelector";
import QuestionList from "@/components/history/QuestionList";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView>
        <View className="gap-5 px-5 pb-10">
          <DateSelector />
          <ActivitySummary />
          {/* The QuestionList component has its own title */}
          <QuestionList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
