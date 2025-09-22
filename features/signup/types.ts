import { SignupRole } from "./signupStore";

export type RoleItem = {
  role: SignupRole;
  icon: string;
  description: string;
  value: "부모" | "자녀" | "조부모";
};
