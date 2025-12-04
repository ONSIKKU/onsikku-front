import BackButton from "@/components/BackButton";
import GenderSelector from "@/components/GenderSelector";
import GeneralButton from "@/components/GeneralButton";
import SignUpHeader from "@/components/SignUpHeader";
import { useSignupStore } from "@/features/signup/signupStore";
import { Item, MONTH_ITEMS, YEAR_ITEMS } from "@/utils/dates";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpSelectBirthAndGenderScreen() {
  // 선택값
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const gender = useSignupStore((g) => g.gender);
  const setGender = useSignupStore((g) => g.setGender);
  const setBirthDate = useSignupStore((b) => b.setBirthDate);

  // useMemo로 값 바뀔 때만 임시저장 , 다음 단계로 버튼 눌러야지 state로 저장됨
  const draftBirth = useMemo(() => {
    if (!selectedYear || !selectedMonth || !selectedDate) return null;
    return `${selectedYear}-${selectedMonth}-${selectedDate}`;
  }, [selectedYear, selectedMonth, selectedDate]);

  // 월/년 선택 시에만 day 리스트 계산
  const DAY_ITEMS: Item[] = useMemo(() => {
    if (!selectedYear || !selectedMonth) return [];
    // 해당 월의 마지막 날짜: 월을 1~12로 넣고 day=0 -> 전달 월의 마지막 날
    const last = new Date(
      parseInt(selectedYear),
      parseInt(selectedMonth),
      0
    ).getDate();
    return Array.from({ length: last }, (_, i) => ({
      label: String(i + 1).padStart(2, "0"),
      value: String(i + 1).padStart(2, "0"),
    }));
  }, [selectedYear, selectedMonth]);
  // deps가 변해야지 callBack함수(계산식)이 실행됨

  const handleNext = () => {
    setBirthDate(draftBirth!); // draftBirth가 null이면 애초에 다음단계로 버튼이 활성화 되지 않음
    // 따라서 !를 붙여서 null값이 안들어온다고 보장해줘도 문제 없음
    // router.push("/signup/image"); // 이미지 선택 화면 비활성화
    router.push("/signup/code");
  };
  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView 
        className="flex-1 px-8" 
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 40 }}>
          <BackButton />
        </View>
        <View style={{ marginBottom: 40 }}>
          <SignUpHeader
            title={`생일과 성별을\n알려주세요`}
            description={`더 정확한 맞춤형 콘텐츠 제공을 위해\n생일과 성별을 입력해주세요`}
          />
        </View>
        <View className="w-full flex-col" style={{ marginBottom: 40 }}>
          <Text className="font-bold text-2xl text-center">생년월일</Text>
          {/* 연 */}
          <View style={{ marginBottom: 12 }}>
            <Text className="font-sans" style={{ marginBottom: 8 }}>출생 연도</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(value) => setSelectedYear(value)}
                style={styles.picker}
                itemStyle={Platform.OS === "ios" ? styles.pickerItem : undefined}
              >
                <Picker.Item label="연도 선택" value="" />
                {YEAR_ITEMS.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View className="flex-row" style={{ gap: 16 }}>
            <View className="flex-1">
              <Text className="font-sans" style={{ marginBottom: 8 }}>월</Text>
              {/* 월 */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={(value) => setSelectedMonth(value)}
                  style={styles.picker}
                  itemStyle={Platform.OS === "ios" ? styles.pickerItem : undefined}
                >
                  <Picker.Item label="월 선택" value="" />
                  {MONTH_ITEMS.map((item) => (
                    <Picker.Item key={item.value} label={item.label} value={item.value} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* 일 */}
            <View className="flex-1">
              <Text className="font-sans" style={{ marginBottom: 8 }}>일</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedDate}
                  onValueChange={(value) => setSelectedDate(value)}
                  style={styles.picker}
                  enabled={!!selectedYear && !!selectedMonth}
                  itemStyle={Platform.OS === "ios" ? styles.pickerItem : undefined}
                >
                  <Picker.Item label="일 선택" value="" />
                  {DAY_ITEMS.map((item) => (
                    <Picker.Item key={item.value} label={item.label} value={item.value} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-col" style={{ marginBottom: 40 }}>
          <Text className="font-bold text-2xl text-center" style={{ marginBottom: 16 }}>성별</Text>
          <View className="flex-row" style={{ gap: 16 }}>
            <GenderSelector
              gender="MALE"
              selected={gender === "MALE"}
              onPress={() => setGender("MALE")}
            />
            <GenderSelector
              gender="FEMALE"
              selected={gender === "FEMALE"}
              onPress={() => setGender("FEMALE")}
            />
          </View>
        </View>
        <GeneralButton
          text={"다음 단계로"}
          rightIcon={<Ionicons name="arrow-forward" size={24} color="white" />}
          isActive={draftBirth !== null && gender !== null}
          onPress={handleNext}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB", // 연한 회색 테두리
    borderRadius: 10,
    backgroundColor: "#FFFFFF", // 흰색 배경
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    ...(Platform.OS === "android" && {
      elevation: 3,
    }),
  },
  picker: {
    height: Platform.OS === "ios" ? 180 : 60,
    backgroundColor: "#FFFFFF",
  },
  pickerItem: {
    height: 180,
    color: "#1F2937", // 진한 회색 텍스트 (잘 보이도록)
    fontSize: 18,
    fontWeight: "500",
  },
});
