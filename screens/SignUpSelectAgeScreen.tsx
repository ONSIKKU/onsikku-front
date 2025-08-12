import AgeSelector from "@/components/AgeSelector";
import GeneralButton from "@/components/GeneralButton";
import SignUpHeader from "@/components/SignUpHeader";
import { useState } from "react";
import { FlatList, View } from "react-native";

export default function SignUpSelectAgeScreen() {
  const ages = [
    { icon: "🧒", age: 10 },
    { icon: "👦", age: 20 },
    { icon: "👨", age: 30 },
    { icon: "🧑‍🦰", age: 40 },
    { icon: "👨‍🦳", age: 50 },
    { icon: "🧑‍🦳", age: 60 },
  ];
  const [age, setAge] = useState<number | null>(null);
  // age는 최종 선택된 나이 -> 나중에 사용할 때 참고
  return (
    <View className="flex-1 justify-center gap-10 px-8">
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
      <GeneralButton text={"다음 단계로 ->"} isActive={age !== null} />
    </View>
  );
}
