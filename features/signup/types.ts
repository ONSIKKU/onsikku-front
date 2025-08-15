import { SignupAge, SignupRole } from "./signupStore";

export type RoleItem = {
  role: SignupRole | null;
  icon: string;
  description: string;
};

export type AgeItem = {
  age: SignupAge | null;
  icon: string;
};
