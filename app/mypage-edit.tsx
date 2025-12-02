import { getItem } from "@/utils/AsyncStorage";
import { getMyPage, patchMyPage, setAccessToken } from "@/utils/api";
import { familyRoleToKo, genderToKo, getRoleIconAndText } from "@/utils/labels";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPageEdit() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [familyRole, setFamilyRole] = useState<
    "PARENT" | "CHILD" | "GRANDPARENT" | ""
  >("");

  // Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempYear, setTempYear] = useState(2000);
  const [tempMonth, setTempMonth] = useState(1);
  const [tempDay, setTempDay] = useState(1);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const token = await getItem("accessToken");
        if (token) setAccessToken(token);
        const res = await getMyPage();
        setGender(res.member.gender || "");
        setBirthDate(res.member.birthDate || "");
        setFamilyRole(res.member.familyRole || "");
      } catch (e: any) {
        setError(e?.message || "정보를 불러오지 못했습니다");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const onSave = async () => {
    try {
      setSaving(true);
      // Validation logic is simpler now since we use picker, but keep basic check
      if (!birthDate) {
        Alert.alert("확인", "생년월일을 선택해 주세요");
        setSaving(false);
        return;
      }
      await patchMyPage({
        gender: gender || undefined,
        birthDate: birthDate || undefined,
        familyRole: (familyRole as any) || undefined,
      });
      Alert.alert("완료", "프로필이 수정되었습니다", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("오류", e?.message || "수정에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  const openDatePicker = () => {
    let y = 2000,
      m = 1,
      d = 1;
    if (birthDate) {
      const parts = birthDate.split("-");
      if (parts.length === 3) {
        y = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10);
        d = parseInt(parts[2], 10);
      }
    }
    setTempYear(y);
    setTempMonth(m);
    setTempDay(d);
    setShowDatePicker(true);
  };

  const confirmDate = () => {
    const y = tempYear;
    const m = tempMonth.toString().padStart(2, "0");
    const d = tempDay.toString().padStart(2, "0");
    setBirthDate(`${y}-${m}-${d}`);
    setShowDatePicker(false);
  };

  // Generate Date Arrays
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // Past 100 years
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = new Date(tempYear, tempMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-orange-50">
        <Text className="font-sans text-gray-600">불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-orange-50">
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Header */}
          <View className="px-4 py-2 flex-row items-center mb-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="font-sans text-xl font-bold text-gray-900">
              내 정보 수정
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 24, paddingBottom: 40, gap: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Avatar */}
            <View className="self-center items-center gap-4 py-4">
              <Text className="text-[100px]">
                {
                  getRoleIconAndText(
                    familyRole || undefined,
                    gender || undefined
                  ).icon
                }
              </Text>
              <Text className="font-sans text-sm text-gray-500">
                프로필 아이콘은 역할에 따라 자동으로 변경돼요
              </Text>
            </View>

            {/* Gender Section */}
            <View className="bg-white p-6 rounded-3xl shadow-sm gap-4">
              <Text className="font-sans text-base font-bold text-gray-800">
                성별
              </Text>
              <View className="flex-row gap-3">
                {(["MALE", "FEMALE"] as const).map((g) => {
                  const isSelected = gender === g;
                  return (
                    <TouchableOpacity
                      key={g}
                      activeOpacity={0.7}
                      onPress={() => setGender(g)}
                      className={`flex-1 py-3 rounded-xl items-center justify-center border-2 ${
                        isSelected
                          ? "bg-orange-50 border-orange-500"
                          : "bg-gray-50 border-transparent"
                      }`}
                    >
                      <Text
                        className={`font-sans text-base ${
                          isSelected
                            ? "text-orange-600 font-bold"
                            : "text-gray-500 font-medium"
                        }`}
                      >
                        {genderToKo(g)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* BirthDate Section */}
            <View className="bg-white p-6 rounded-3xl shadow-sm gap-4">
              <Text className="font-sans text-base font-bold text-gray-800">
                생년월일
              </Text>
              <TouchableOpacity
                onPress={openDatePicker}
                className="bg-gray-50 rounded-xl px-4 py-3 flex-row justify-between items-center"
              >
                <Text
                  className={`font-sans text-base ${
                    birthDate ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {birthDate || "YYYY-MM-DD"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Role Section */}
            <View className="bg-white p-6 rounded-3xl shadow-sm gap-4">
              <Text className="font-sans text-base font-bold text-gray-800">
                가족 내 역할
              </Text>
              <View className="flex-row gap-3 flex-wrap">
                {(["PARENT", "CHILD", "GRANDPARENT"] as const).map((r) => {
                  const isSelected = familyRole === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      activeOpacity={0.7}
                      onPress={() => setFamilyRole(r)}
                      className={`px-5 py-3 rounded-xl items-center justify-center border-2 ${
                        isSelected
                          ? "bg-orange-50 border-orange-500"
                          : "bg-gray-50 border-transparent"
                      }`}
                    >
                      <Text
                        className={`font-sans text-base ${
                          isSelected
                            ? "text-orange-600 font-bold"
                            : "text-gray-500 font-medium"
                        }`}
                      >
                        {familyRoleToKo(r)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {error ? (
              <Text className="font-sans text-red-500 text-center">
                {error}
              </Text>
            ) : null}

            {/* Save Button */}
            <TouchableOpacity
              onPress={onSave}
              disabled={saving}
              activeOpacity={0.8}
              className="mt-4 bg-onsikku-dark-orange rounded-full items-center justify-center py-4 shadow-sm"
            >
              <Text className="font-sans text-white font-bold text-lg">
                {saving ? "저장 중..." : "저장하기"}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Date Picker Modal */}
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-white rounded-t-3xl p-6">
                <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-4">
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text className="font-sans text-gray-500 text-base">
                      취소
                    </Text>
                  </TouchableOpacity>
                  <Text className="font-sans font-bold text-lg text-gray-800">
                    생년월일 선택
                  </Text>
                  <TouchableOpacity onPress={confirmDate}>
                    <Text className="font-sans text-orange-500 font-bold text-base">
                      확인
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-center items-center">
                  <View className="flex-1">
                    <Picker
                      selectedValue={tempYear}
                      onValueChange={(itemValue) => setTempYear(itemValue)}
                      itemStyle={{ fontSize: 16, height: 150 }}
                    >
                      {years.map((year) => (
                        <Picker.Item
                          key={year}
                          label={`${year}년`}
                          value={year}
                          color="#1F2937"
                        />
                      ))}
                    </Picker>
                  </View>
                  <View className="flex-1">
                    <Picker
                      selectedValue={tempMonth}
                      onValueChange={(itemValue) => setTempMonth(itemValue)}
                      itemStyle={{ fontSize: 16, height: 150 }}
                    >
                      {months.map((month) => (
                        <Picker.Item
                          key={month}
                          label={`${month}월`}
                          value={month}
                          color="#1F2937"
                        />
                      ))}
                    </Picker>
                  </View>
                  <View className="flex-1">
                    <Picker
                      selectedValue={tempDay}
                      onValueChange={(itemValue) => setTempDay(itemValue)}
                      itemStyle={{ fontSize: 16, height: 150 }}
                    >
                      {days.map((day) => (
                        <Picker.Item
                          key={day}
                          label={`${day}일`}
                          value={day}
                          color="#1F2937"
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
