import { BASE_URL } from "./const";
import {
  getAccessTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
} from "../utils/accessTokenHandler";
import { UserInfo } from "../types/user";

//로그인 성공 여부 타입
type LoginResult = "success" | "fail";

//로그인 성공 시 엑세스 토큰과 함께 결과를 나타내는 타입(실패시 엑세스 토큰은 null)
export type LoginResultWithToken =
  | {
      result: "success";
      access_token: string;
    }
  | {
      result: "fail";
      access_token: null;
    };

//로그인 요청을 위한 인터페이스
export interface LoginRequest {
  username: string;
  password: string;
}

//토큰을 사용한 로그인 기능 : args라는 매개변수를 받는데 args는 LoginRequest타입으로 사용자 이름과 비밀번호를 가지는 객체 타입이다.
//로그인 api호출 후 성공하면 토큰 반환
export const loginWithToken = async (
  args: LoginRequest
): Promise<LoginResultWithToken> => {
  // ✅TODO(2-1): 로그인 API 호출 및 토큰 반환하기
  // POST, `${ BASE_URL }/auth/login`을 호출하세요.
  // API Spec은 강의 자료를 참고하세요.
  // access_token 발급에 성공한 경우에는 { result: 'success', access_token: string } 형태의 값을 반환하세요.

  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    //api호출(로그인 요청) 후 응답을 loginRes에 저장
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (loginRes.ok) {
    //응답을 받은 객체 loginRes에는 ok라는 속성이 있는데 이 속성은 http응답 상태코드를 나타내며, 상태고드가 200번대의 경우 true로 설정
    const loginResponseData = await loginRes.json();
    return {
      result: "success",
      access_token: loginResponseData.access_token, //응답받은 객체에 access_token이 있다
    };
  }

  return {
    result: "fail",
    access_token: null,
  };
};

// ✅TODO(2-1): 함수에서 토큰을 직접 주입받아 사용하기
// GET, `${ BASE_URL }/profile`을 호출하세요.
// argument로 전달받은 token을 Authorization header에 Bearer token으로 넣어주세요.
// API Spec은 강의 자료를 참고하세요.
// 유저 정보 조회에 성공한 경우에는 UserInfo 타입의 값을 반환하세요.
export const login = async (args: LoginRequest): Promise<LoginResult> => {
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    //로그인 api호출
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (loginRes.ok) {
    //성공 시 엑세스토큰을 로컬스토리지에 저장하고 결과만 반환
    const loginResponseData = await loginRes.json();
    saveAccessTokenToLocalStorage(loginResponseData.access_token);
    return "success";
  }
  return "fail";
};

//매개변수로 엑세스 토큰을 사용하여 로그인된 사용자 정보(UserInfo 타입)를 가져온다
export const getCurrentUserInfoWithToken = async (
  token: string
): Promise<UserInfo | null> => {
  const userInfoRes = await fetch(`${BASE_URL}/profile`, {
    //토큰을 이용한 프로필 api 호출
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (userInfoRes.ok) {
    //성공한 경우
    return userInfoRes.json() as Promise<UserInfo>; //as : 타입단언 - Promise<UserInfo>타입을 반환한다~
    //TypeScript 컴파일러가 이를 이해하고 해당 타입으로 처리 -> Promise<UserInfo> 타입이 되도록 변환시켜줌
  }
  return null;
};

// ✅TODO(2-2): 로컬스토리지에서 토큰을 가져와 사용하기
// GET, `${ BASE_URL }/profile`을 호출하세요.
// 로컬 스토리지에 있는 token을 getAccessTokenFromLocalStorage로 가져와서 Authorization header에 Bearer token으로 넣어주세요.
// API Spec은 강의 자료를 참고하세요.
// 유저 정보 조회에 성공한 경우에는 UserInfo 타입의 값을 반환하세요.
export const getCurrentUserInfo = async (): Promise<UserInfo | null> => {
  const userInfoRes = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
    },
  });

  if (userInfoRes.ok) {
    return userInfoRes.json() as Promise<UserInfo>;
  }

  return null;
};
