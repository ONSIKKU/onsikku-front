export const familyRoleToKo = (v?: string | null) => {
  switch (v) {
    case "PARENT":
      return "부모";
    case "CHILD":
      return "자녀";
    case "GRANDPARENT":
      return "조부모";
    default:
      return "-";
  }
};

export const grandParentTypeToKo = (v?: string | null) => {
  switch (v) {
    case "PATERNAL":
      return "친가";
    case "MATERNAL":
      return "외가";
    default:
      return "-";
  }
};

export const genderToKo = (v?: string | null) => {
  switch (v) {
    case "MALE":
      return "남성";
    case "FEMALE":
      return "여성";
    default:
      return "-";
  }
};

export const roleToKo = (v?: string | null) => {
  switch (v) {
    case "MEMBER":
      return "멤버";
    case "ADMIN":
      return "관리자";
    default:
      return "-";
    }
};
