import { create } from "zustand";

export type SignupRole = "아빠" | "엄마" | "자녀" | "조부모" | "기타";
export type SignupAge = 10 | 20 | 30 | 40 | 50 | 60;

export type SignupState = {
  role: SignupRole | null;
  age: SignupAge | null;
  uri: string | null;
  familyName: string;
  familyInvitationCode: string;
  familyMode: "CREATE" | "JOIN";

  setRole: (r: SignupRole | null) => void;
  setAge: (a: SignupAge | null) => void;
  setUri: (i: string | null) => void;
  setFamilyName: (n: string) => void;
  setFamilyInvitationCode: (c: string) => void;
  setFamilyMode: (m: "CREATE" | "JOIN") => void;
  reset: () => void;
};

export const useSignupStore = create<SignupState>((set) => ({
  role: null,
  age: null,
  uri: null,
  familyName: "",
  familyInvitationCode: "",
  familyMode: "JOIN",

  // set 함수 모음
  setRole: (r) => set({ role: r }),
  setAge: (a) => set({ age: a }),
  setUri: (i) => set({ uri: i }),
  setFamilyName: (n) => set({ familyName: n }),
  setFamilyInvitationCode: (c) => set({ familyInvitationCode: c }),
  setFamilyMode: (m) => set({ familyMode: m }),

  //reset
  reset: () => set({ role: null, age: null }),
}));
