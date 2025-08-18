import BackButton from "@/components/BackButton";
import GenderSelector from "@/components/GenderSelector";
import GeneralButton from "@/components/GeneralButton";
import SignUpHeader from "@/components/SignUpHeader";
import { useSignupStore } from "@/features/signup/signupStore";
import { Item, MONTH_ITEMS, YEAR_ITEMS } from "@/utils/dates";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpSelectBirthAndGenderScreen() {
  // 드롭다운 오픈 상태
  const [openYear, setOpenYear] = useState(false);
  const [openMonth, setOpenMonth] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  // 선택값
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  // DropDown 스타일링
  const DropDownTextStyle: StyleProp<TextStyle> = {
    fontSize: 15,
    fontWeight: "bold",
  };

  const DropDownStyle: StyleProp<ViewStyle> = {
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
  };

  const DropDownContainerStyle: StyleProp<ViewStyle> = {
    backgroundColor: "#fff", // 흰 배경
    borderWidth: 1,
    borderColor: "#fffffb", // 연한 회색 (tailwind border-gray-200 느낌)
    borderRadius: 10, // 모서리 둥글게
    shadowColor: "#000", // 안드로이드/ios 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3, // 안드로이드 그림자
    paddingVertical: 4, // 옵션 위아래 여백
  };

  // 서로 열림 상쇄 (겹침 방지)
  useEffect(() => {
    if (openYear) {
      setOpenMonth(false);
      setOpenDate(false);
    }
  }, [openYear]);
  useEffect(() => {
    if (openMonth) {
      setOpenYear(false);
      setOpenDate(false);
    }
  }, [openMonth]);
  useEffect(() => {
    if (openDate) {
      setOpenYear(false);
      setOpenMonth(false);
    }
  }, [openDate]);

  const handleNext = () => {
    setBirthDate(draftBirth!); // draftBirth가 null이면 애초에 다음단계로 버튼이 활성화 되지 않음
    // 따라서 !를 붙여서 null값이 안들어온다고 보장해줘도 문제 없음
    router.push("/signup/image");
  };
  return (
    <SafeAreaView className="flex-1 justify-start gap-10 px-8">
      <BackButton />
      <SignUpHeader
        title={`생일과 성별을\n알려주세요`}
        description={`더 정확한 맞춤형 콘텐츠 제공을 위해\n생일과 성별을 입력해주세요`}
      />
      <View className="w-full flex-col gap-3">
        <Text className="font-bold text-2xl text-center">생년월일</Text>
        {/* 연 */}
        <View className="gap-2 w-full">
          <Text className="font-sans">출생 연도</Text>
          <DropDownPicker
            style={DropDownStyle}
            open={openYear}
            value={selectedYear}
            items={YEAR_ITEMS}
            setOpen={setOpenYear}
            setValue={setSelectedYear}
            placeholder="연도 선택"
            listMode="SCROLLVIEW"
            zIndex={3000}
            textStyle={DropDownTextStyle}
            dropDownContainerStyle={DropDownContainerStyle}
          />
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 gap-2">
            <Text className="font-sans">월</Text>
            {/* 월 */}
            <DropDownPicker
              style={DropDownStyle}
              open={openMonth}
              value={selectedMonth}
              items={MONTH_ITEMS}
              setOpen={setOpenMonth}
              setValue={setSelectedMonth}
              placeholder="월 선택"
              listMode="SCROLLVIEW"
              zIndex={2000}
              textStyle={DropDownTextStyle}
              dropDownContainerStyle={DropDownContainerStyle}
            />
          </View>

          {/* 일 */}
          <View className="flex-1 gap-2">
            <Text className="font-sans">일</Text>
            <DropDownPicker
              style={DropDownStyle}
              open={openDate}
              value={selectedDate}
              items={DAY_ITEMS}
              setOpen={setOpenDate}
              setValue={setSelectedDate}
              placeholder="일 선택"
              disabled={!selectedYear || !selectedMonth}
              listMode="SCROLLVIEW"
              zIndex={1000}
              textStyle={DropDownTextStyle}
              disabledStyle={{ opacity: 0.55 }}
              dropDownContainerStyle={DropDownContainerStyle}
            />
          </View>
        </View>
      </View>
      <View className="flex-col gap-4">
        <Text className="font-bold text-2xl text-center">성별</Text>
        <View className="flex-row gap-4">
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
        text={"다음 단계로 ->"}
        isActive={draftBirth !== null && gender !== null}
        onPress={handleNext}
      />
    </SafeAreaView>
  );
}
