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

// 역할과 성별에 따른 아이콘과 텍스트 반환
export const getRoleIconAndText = (
  familyRole?: string | null,
  gender?: string | null
): { icon: string; text: string } => {
  if (!familyRole || !gender) {
    return { icon: "👤", text: "-" };
  }

  if (familyRole === "PARENT") {
    if (gender === "MALE") {
      return { icon: "👨🏻", text: "아빠" };
    } else if (gender === "FEMALE") {
      return { icon: "👩🏻", text: "엄마" };
    }
  } else if (familyRole === "CHILD") {
    if (gender === "MALE") {
      return { icon: "👦🏻", text: "아들" };
    } else if (gender === "FEMALE") {
      return { icon: "👧🏻", text: "딸" };
    }
  } else if (familyRole === "GRANDPARENT") {
    if (gender === "MALE") {
      return { icon: "👴🏻", text: "할아버지" };
    } else if (gender === "FEMALE") {
      return { icon: "👵🏻", text: "할머니" };
    }
  }

  return { icon: "👤", text: "-" };
};
