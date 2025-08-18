import { SignupRole } from "./signupStore";

export type RoleItem = {
  role: SignupRole | null;
  icon: string;
  description: string;
};
