export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const DEFAULT_BASE_URL = "https://api.onsikku.xyz";

let baseUrl = DEFAULT_BASE_URL;

export const setBaseUrl = (url: string) => {
  baseUrl = url || DEFAULT_BASE_URL;
};

// Lightweight token storage bridge
let inMemoryToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryToken = token;
};

const getHeaders = (extra?: Record<string, string>) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extra || {}),
  };
  if (inMemoryToken) {
    headers["Authorization"] = `Bearer ${inMemoryToken}`;
  }
  return headers;
};

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = baseUrl + path;
  const res = await fetch(url, {
    ...init,
    headers: getHeaders(init?.headers as Record<string, string> | undefined),
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (json && (json.message || json.error)) || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return (json && (json.result ?? json)) as T;
}

// MyPage types (subset tailored for UI)
export type FamilyRole = "PARENT" | "CHILD" | "GRANDPARENT";
export type Role = "MEMBER" | "ADMIN";

export type MypageResponse = {
  familyName: string;
  familyInvitationCode: string;
  role: Role;
  profileImageUrl: string | null;
  familyRole: FamilyRole;
  birthDate: string; // yyyy-MM-dd
  gender: "MALE" | "FEMALE";
  alarmEnabled: boolean;
};

export type MypagePatch = Partial<{
  profileImageUrl: string | null;
  familyRole: FamilyRole;
  birthDate: string; // yyyy-MM-dd
  gender: "MALE" | "FEMALE";
  isAlarmEnabled: boolean;
  regenerateFamilyInvitationCode: boolean;
}>;

export function getMyPage() {
  return apiFetch<MypageResponse>("/api/members/mypage", { method: "GET" });
}

export function patchMyPage(payload: MypagePatch) {
  return apiFetch<MypageResponse>("/api/members/mypage", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteMember() {
  // POST /api/members/delete with empty body
  return apiFetch<void>("/api/members/delete", { method: "POST" });
}

// Auth types
export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  registrationToken?: string;
  registered: boolean;
};

export type SignupRequest = {
  registrationToken: string;
  grandParentType?: "PATERNAL" | "MATERNAL" | null;
  familyRole: "PARENT" | "CHILD" | "GRANDPARENT";
  gender: "MALE" | "FEMALE";
  birthDate: string; // yyyy-MM-dd
  profileImageUrl?: string | null;
  familyName: string;
  familyInvitationCode?: string;
  familyMode: "CREATE" | "JOIN";
};

// 회원가입 (JWT 불필요)
export async function signup(payload: SignupRequest) {
  console.log("[회원가입 요청]", payload);
  const url = baseUrl + "/api/auth/signup";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (json && (json.message || json.error)) || `HTTP ${res.status}`;
    console.error("[회원가입 에러]", message);
    throw new Error(message);
  }

  const result = (json && (json.result ?? json)) as AuthResponse;
  console.log("[회원가입 응답]", result);
  return result;
}

// 로그아웃
export async function logout() {
  console.log("[로그아웃 요청]");
  const response = await apiFetch<string>("/api/members/logout", {
    method: "POST",
  });
  console.log("[로그아웃 응답]", response);
  return response;
}

// Question types
export type QuestionState = "PENDING" | "SENT" | "ANSWERED" | "EXPIRED" | "FAILED";

export type QuestionMember = {
  id: string;
  familyRole: FamilyRole;
  profileImageUrl: string | null;
  gender: "MALE" | "FEMALE";
};

export type QuestionInstance = {
  id: string;
  content: string;
  subject: QuestionMember | null;
};

export type QuestionAssignment = {
  id: string;
  questionInstance: QuestionInstance;
  member: QuestionMember;
  state: QuestionState;
  dueAt: string; // date-time
  sentAt: string | null; // date-time
  answeredAt: string | null; // date-time
  expiredAt: string | null; // date-time
};

// 오늘의 질문 조회
export async function getTodayQuestions() {
  console.log("[오늘의 질문 조회 요청]");
  const response = await apiFetch<QuestionAssignment[]>("/api/questions", {
    method: "GET",
  });
  console.log("[오늘의 질문 조회 응답]", response);
  return response;
}
