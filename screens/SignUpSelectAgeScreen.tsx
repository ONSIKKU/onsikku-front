import AgeSelector from "@/components/AgeSelector";
import BackButton from "@/components/BackButton";
import GeneralButton from "@/components/GeneralButton";
import SignUpHeader from "@/components/SignUpHeader";
import { useSignupStore } from "@/features/signup/signupStore";
import { AgeItem } from "@/features/signup/types";
import { router } from "expo-router";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ages: AgeItem[] = [
  { icon: "🧒", age: 10 },
  { icon: "👦", age: 20 },
  { icon: "👨", age: 30 },
  { icon: "🧑‍🦰", age: 40 },
  { icon: "👨‍🦳", age: 50 },
  { icon: "🧑‍🦳", age: 60 },
];

export default function SignUpSelectAgeScreen() {
  const age = useSignupStore((a) => a.age);
  const setAge = useSignupStore((a) => a.setAge);
  const handleNext = () => {
    if (!age) return;
    router.push("/signup/image");
  };
  return (
    <SafeAreaView className="flex-1 justify-start gap-10 px-8">
      <BackButton />
      <SignUpHeader
        title={`연령대를\n알려주세요`}
        description={`더 적합한 질문을 드리기 위해\n연령대를 선택해주세요`}
      />
      <FlatList
        className="grow-0"
        data={ages}
        renderItem={({ item }) => (
          <AgeSelector
            {...item}
            selected={age === item.age}
            onPress={() => setAge(item.age)}
          />
        )}
        scrollEnabled={false}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ rowGap: 12 }}
      />
      <GeneralButton
        text={"다음 단계로 ->"}
        isActive={age !== null}
        onPress={handleNext}
      />
    </SafeAreaView>
  );
}
