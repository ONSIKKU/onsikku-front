import TodayRespondent from "@/components/TodayRespondent";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView className="flex-1 w-full px-10 gap-6 bg-onsikku-main-orange justify-start items-center">
      <TodayRespondent />
    </SafeAreaView>
  );
}
