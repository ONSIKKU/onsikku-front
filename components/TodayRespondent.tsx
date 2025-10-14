import { Clock4, Star } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import RoleCard from "./RoleCard";

const family = [
  {
    icon: "👩🏻",
    roleName: "엄마",
  },
  {
    icon: "👨🏻",
    roleName: "아빠",
  },
  {
    icon: "👦🏻",
    roleName: "아들",
  },
  {
    icon: "👧🏻",
    roleName: "딸",
  },
  // {
  //   icon: "👵🏻",
  //   roleName: "할머니",
  // },
  // {
  //   icon: "👴🏻",
  //   roleName: "할아버지",
  // },
  // {
  //   role: "GRANDPARENT",
  //   icon: "👴🏻👵🏻",
  //   description: "할아버지 또는 할머니예요",
  //   roleName: "조부모",
  // },
];

export default function TodayRespondent() {
  const [respondent, setResponsdent] = useState("아빠");
  return (
    <View className="bg-white w-full p-4 gap-2 rounded-xl flex-1/2">
      <View className="flex flex-row items-center gap-2">
        <Star fill="#FB923C" color="#FB923C" size={24} />
        <Text className="font-bold text-xl">오늘의 주인공</Text>
      </View>

      <View className="flex flex-row items-center">
        {family.map((item) => (
          <RoleCard {...item} isSelected={respondent === item.roleName} />
        ))}
      </View>
      <View className="flex flex-row gap-2 justify-center items-center">
        <Clock4 size={20} color={"#FB923C"} />
        <Text className="text-onsikku-dark-orange font-bold">
          1명이 답변 대기중이에요
        </Text>
      </View>
    </View>
  );
}
