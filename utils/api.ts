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
  const headers = getHeaders(init?.headers as Record<string, string> | undefined);
  
  console.log("[API 요청]", {
    url,
    method: init?.method || "GET",
    hasToken: !!headers["Authorization"],
  });
  
  const res = await fetch(url, {
    ...init,
    headers,
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    console.error("[API 에러]", {
      status: res.status,
      statusText: res.statusText,
      response: json,
    });
    const message = (json && (json.message || json.error)) || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return (json && (json.result ?? json)) as T;
}

// MyPage types (subset tailored for UI)
export type FamilyRole = "PARENT" | "CHILD" | "GRANDPARENT";
export type Role = "MEMBER" | "ADMIN";

export type MypageResponse = {
  memberId?: string;
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

// 토큰 재발급
export type TokenRefreshRequest = {
  refreshToken: string;
};

export async function refreshToken(refreshToken: string) {
  console.log("[토큰 재발급 요청]");
  const url = baseUrl + "/api/auth/refresh";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (json && (json.message || json.error)) || `HTTP ${res.status}`;
    console.error("[토큰 재발급 에러]", message);
    throw new Error(message);
  }

  const result = (json && (json.result ?? json)) as AuthResponse;
  console.log("[토큰 재발급 응답]", result);
  return result;
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

// QuestionResponse 타입 정의 (OpenAPI 스펙에 맞춤)
export type QuestionResponse = {
  questionDetailsList?: QuestionDetails[]; // 월별 조회 시
  questionDetails?: QuestionDetails; // 단일 질문 조회 시
  totalQuestions?: number;
  answeredQuestions?: number;
  totalReactions?: number;
  todayQuestionAssignments?: QuestionAssignment[]; // 오늘의 질문 조회 시
  todayQuestionInstanceId?: string;
};

// 오늘의 질문 조회
export async function getTodayQuestions() {
  console.log("[오늘의 질문 조회 요청]");
  const response = await apiFetch<QuestionResponse>("/api/questions", {
    method: "GET",
  });
  console.log("[오늘의 질문 조회 응답]", response);
  // 호환성을 위해 QuestionAssignment[] 반환
  return response.todayQuestionAssignments || [];
}

// Answer types
export type AnswerType = "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "FILE" | "MIXED";

export type AnswerRequest = {
  answerId?: string; // 수정/삭제 시 필요
  questionAssignmentId: string;
  answerType?: AnswerType; // 생성 시 필수, 수정/삭제 시 선택
  content?: any; // JsonNode (string or object), 생성/수정 시 필요
};

export type Answer = {
  answerId: string;
  memberId: string;
  familyRole: FamilyRole;
  gender: "MALE" | "FEMALE";
  createdAt: string; // date-time
  content: any; // JsonNode
  likeReactionCount: number;
  angryReactionCount: number;
  sadReactionCount: number;
  funnyReactionCount: number;
  // 호환성을 위한 필드 (기존 코드에서 사용)
  id?: string;
  questionAssignment?: QuestionAssignment;
  member?: QuestionMember;
};

// 답변 생성
export async function createAnswer(payload: AnswerRequest) {
  console.log("[답변 생성 요청]", payload);
  console.log("[답변 생성] 현재 토큰:", inMemoryToken ? "설정됨" : "없음");
  
  const requestPayload = {
    questionAssignmentId: payload.questionAssignmentId,
    answerType: payload.answerType || "TEXT",
    content: payload.content,
  };
  
  const response = await apiFetch<{
    answerId: string;
    memberId: string;
    familyRole: FamilyRole;
    gender: "MALE" | "FEMALE";
    createdAt: string;
    content: any;
    likeReactionCount: number;
    angryReactionCount: number;
    sadReactionCount: number;
    funnyReactionCount: number;
  }>("/api/questions/answers", {
    method: "POST",
    body: JSON.stringify(requestPayload),
  });
  console.log("[답변 생성 응답]", response);
  
  // 호환성을 위해 Answer 타입으로 변환
  return {
    ...response,
    id: response.answerId,
  } as Answer;
}

// 질문 인스턴스 상세 조회 (답변 포함)
export async function getQuestionInstanceDetails(questionInstanceId: string) {
  console.log("[질문 인스턴스 상세 조회 요청]", { questionInstanceId });
  const response = await apiFetch<QuestionResponse>(
    `/api/questions/${questionInstanceId}`,
    {
      method: "GET",
    }
  );
  console.log("[질문 인스턴스 상세 조회 응답]", response);
  return response;
}

// 특정 질문의 답변 조회 (questionInstanceId를 통해)
export async function getAnswers(questionInstanceId: string) {
  console.log("[답변 조회 요청]", { questionInstanceId });
  const questionData = await getQuestionInstanceDetails(questionInstanceId);
  
  // QuestionResponse의 questionDetails.answers에서 답변 추출
  const answers = questionData.questionDetails?.answers || [];
  
  // 호환성을 위해 Answer[] 타입으로 변환
  const convertedAnswers: Answer[] = answers.map((ans: any) => ({
    ...ans,
    id: ans.answerId,
  }));
  
  console.log("[답변 조회 응답]", convertedAnswers);
  return convertedAnswers;
}

// 답변 수정
export async function updateAnswer(payload: AnswerRequest) {
  console.log("[답변 수정 요청]", payload);
  const requestPayload = {
    answerId: payload.answerId,
    questionAssignmentId: payload.questionAssignmentId,
    answerType: payload.answerType,
    content: payload.content,
  };
  
  const response = await apiFetch<{
    answerId: string;
    memberId: string;
    familyRole: FamilyRole;
    gender: "MALE" | "FEMALE";
    createdAt: string;
    content: any;
    likeReactionCount: number;
    angryReactionCount: number;
    sadReactionCount: number;
    funnyReactionCount: number;
  }>("/api/questions/answers", {
    method: "PUT",
    body: JSON.stringify(requestPayload),
  });
  console.log("[답변 수정 응답]", response);
  
  // 호환성을 위해 Answer 타입으로 변환
  return {
    ...response,
    id: response.answerId,
  } as Answer;
}

// 답변 삭제
export async function deleteAnswer(payload: AnswerRequest) {
  console.log("[답변 삭제 요청]", payload);
  const requestPayload = {
    answerId: payload.answerId,
    questionAssignmentId: payload.questionAssignmentId,
  };
  
  const response = await apiFetch<string>("/api/questions/answers", {
    method: "DELETE",
    body: JSON.stringify(requestPayload),
  });
  console.log("[답변 삭제 응답]", response);
  return response;
}

// QuestionDetails 타입 (OpenAPI 스펙에 맞춤)
export type QuestionDetails = {
  questionInstanceId: string;
  questionContent: string;
  questionAssignments?: QuestionAssignment[];
  answers?: Answer[];
  comments?: any[];
  // 호환성을 위한 필드
  questionAssignmentId?: string;
  memberId?: string;
  familyRole?: FamilyRole;
  profileImageUrl?: string | null;
  gender?: "MALE" | "FEMALE";
  state?: QuestionState;
  dueAt?: string;
  sentAt?: string | null;
  answeredAt?: string | null;
  expiredAt?: string | null;
};

// 월별 질문 조회
export async function getQuestionsByMonth(year: number, month: number) {
  console.log("[월별 질문 조회 요청]", { year, month });
  const params = new URLSearchParams({
    year: year.toString(),
    month: month.toString(),
  });
  const response = await apiFetch<QuestionResponse>(
    `/api/questions/monthly?${params.toString()}`,
    {
      method: "GET",
    }
  );
  console.log("[월별 질문 조회 응답]", response);
  
  // 호환성을 위해 questionDetailsList를 questionDetails로 변환
  const questionDetailsList = response.questionDetailsList || [];
  const convertedDetails: QuestionDetails[] = questionDetailsList.map((qd) => ({
    ...qd,
    questionAssignmentId: qd.questionAssignments?.[0]?.id || "",
    memberId: qd.questionAssignments?.[0]?.member?.id || "",
    familyRole: qd.questionAssignments?.[0]?.member?.familyRole || "PARENT",
    profileImageUrl: qd.questionAssignments?.[0]?.member?.profileImageUrl || null,
    gender: qd.questionAssignments?.[0]?.member?.gender || "MALE",
    state: qd.questionAssignments?.[0]?.state || "PENDING",
    dueAt: qd.questionAssignments?.[0]?.dueAt || "",
    sentAt: qd.questionAssignments?.[0]?.sentAt || null,
    answeredAt: qd.questionAssignments?.[0]?.answeredAt || null,
    expiredAt: qd.questionAssignments?.[0]?.expiredAt || null,
  }));
  
  return {
    ...response,
    questionDetails: convertedDetails,
  } as QuestionResponse & { questionDetails: QuestionDetails[] };
}

// 최근 답변 조회 (최근 N개월의 질문에서 답변된 것들만)
export async function getRecentAnswers(months: number = 1, limit: number = 10) {
  console.log("[최근 답변 조회 요청]", { months, limit });
  
  const now = new Date();
  const allAnswers: Answer[] = [];
  
  // 최근 N개월의 질문들을 조회
  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    try {
      const questionData = await getQuestionsByMonth(year, month);
      const questionDetails = (questionData as any).questionDetails || [];
      const answeredQuestions = questionDetails.filter(
        (q: QuestionDetails) => q.state === "ANSWERED" || q.answeredAt
      );
      
      // 각 질문 인스턴스에 대한 답변 조회
      for (const question of answeredQuestions) {
        try {
          if (question.questionInstanceId) {
            const questionDetailsData = await getQuestionInstanceDetails(question.questionInstanceId);
            const answers = questionDetailsData.questionDetails?.answers || [];
            
            // 호환성을 위해 Answer[] 타입으로 변환
            const convertedAnswers: Answer[] = answers.map((ans: any) => ({
              ...ans,
              id: ans.answerId,
              questionAssignment: question.questionAssignments?.[0],
              member: {
                id: ans.memberId,
                familyRole: ans.familyRole,
                profileImageUrl: null,
                gender: ans.gender,
              },
            }));
            
            allAnswers.push(...convertedAnswers);
          }
        } catch (e) {
          console.error(`[답변 조회 실패] ${question.questionInstanceId}`, e);
        }
      }
    } catch (e) {
      console.error(`[월별 질문 조회 실패] ${year}-${month}`, e);
    }
  }
  
  // 시간순 정렬 (최신순)
  allAnswers.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
  
  // 최대 limit개만 반환
  const result = allAnswers.slice(0, limit);
  console.log("[최근 답변 조회 응답]", result);
  return result;
}
