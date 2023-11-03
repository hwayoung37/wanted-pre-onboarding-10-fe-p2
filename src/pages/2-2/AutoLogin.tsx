import React, { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentUserInfo, login } from "../../api/login";
import { UserInfo } from "../../types/user";

//자동로그인 기능 : 사용자가 다른 페이지로 이동 시 자동으로 로그인 정보를 가져와서 사용자 정보를 표시한다
const AutoLogin = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const isDataFetched = useRef(false); //데이터 가져왔는지 여부

  //사용자 정보를 가져와서 화면에 표시
  const getUserInfo = useCallback(async () => {
    const userInfo = await getCurrentUserInfo();

    // ✅TODO: 유저 정보 가져오기 (getCurrentUserInfo 함수 사용)
    // getCurrentUserInfo 함수를 이용해 유저 정보를 가져온 후, setUserInfo 함수를 이용해 userInfo 상태를 업데이트해주세요.
    if (userInfo === null) return;
    //사용자 정보를 가져오지 못한 경우 그냥 종료된다. -> 로컬스토리지에 토큰이 없으면 로그인이 안된것이므로 함수 수행할 필요 없다

    setUserInfo(userInfo);

    isDataFetched.current = true;
  }, []);

  useEffect(() => {
    //컴포넌트가 마운트 될 때 getUserInfo를 호출하는데 isDataFetched.current가 true이면 호출 중지
    if (isDataFetched.current) return;
    getUserInfo();
  }, []);

  return (
    <div>
      <h1>Another page</h1>
      <div>
        <h2>User info</h2>
        {JSON.stringify(userInfo)}
      </div>
    </div>
  );
};

export default AutoLogin;
