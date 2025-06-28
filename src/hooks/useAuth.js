import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

const useAuth = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const saveAccessTokenToCookie = (accessToken) => {
    const expires = new Date(getAccessTokenExpiry(accessToken)).toUTCString();
    document.cookie = `accessToken=${accessToken}; path=/; expires=${expires};`;
  };

  const removeAccessTokenCookie = () => {
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
  };

  const getAccessTokenExpiry = (accessToken) => {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      return payload.exp * 1000;
    } catch {
      return null;
    }
  };

  const parseUserIdFromToken = (accessToken) => {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      return payload.userId;
    } catch {
      return null;
    }
  };

  const SetAutoRefresh = (accessToken) => {
    const expiryTime = getAccessTokenExpiry(accessToken);
    if (!expiryTime) return;

    const now = Date.now();
    const delay = expiryTime - now - 60 * 1000;
    if (refreshTimer) clearTimeout(refreshTimer);

    const timer = setTimeout(() => {
      onSilentRefresh();
    }, delay > 0 ? delay : 0);

    setRefreshTimer(timer);
    setAutoRefresh(true);
  };

  const onLoginSuccess = (response) => {
    const { accessToken } = response.data;
    saveAccessTokenToCookie(accessToken);
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setData(response.data);

    const userId = parseUserIdFromToken(accessToken);
    if (userId) {
      localStorage.setItem("userId", userId.toString());
    }
    setAutoRefresh(accessToken);
  };

  const onSilentRefresh = async () => {
    try {
      const response = await axios.post(
        "https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/auth/refresh",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        onLoginSuccess(response);
      }
    } catch (err) {
      toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
      removeAccessTokenCookie();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      window.location.href = "/login";
      console.error(err);
    }
  };

  const SendToEmail = async (email) => {
    setError(null);
    try {
      const response = await axios.post(
        "https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/auth/sendCode/signup",
        { email }
      );
      setData(response.data);
      return { success: true };
    } catch (err) {
      setError(err);
      if (err.response) {
        if (err.response.status === 409) {
          toast.warning("이미 존재하는 이메일입니다. 다른 이메일을 사용해주세요.");
        } else {
          toast.error("인증코드 에러 발생");
        }
      } else {
        toast.error("서버와의 연결이 끊어졌습니다. 나중에 다시 시도해주세요.");
      }
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const signup = async (email, name, password, code) => {
    setError(null);
    try {
      const response = await axios.post(
        "https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/auth/signup",
        { name, email, password, code },
        { withCredentials: true }
      );
      setData(response.data);
      return { success: true };
    } catch (err) {
      setError(err);
      if (err.response?.status === 409) {
        toast.warning("이미 존재하는 이메일입니다. 다른 이메일을 사용해주세요.");
      } else if (err.response?.status === 500) {
        toast.warning("이미 존재하는 아이디입니다. 다른 아이디를 사용해주세요.");
      } else {
        toast.error("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      return { success: false, error: err };
    }
  };

  const login = async (name, password) => {
    setError(null);
    try {
      const response = await axios.post(
        "https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/auth/signin",
        { name, password },
        { withCredentials: true }
      );
      onLoginSuccess(response);
      return { success: true };
    } catch (err) {
      setError(err);
      if (err.response?.status === 401) {
        toast.warning("이름이나 비밀번호가 잘못되었습니다.");
      } else {
        toast.error("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      return { success: false };
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !autoRefresh) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const userId = parseUserIdFromToken(accessToken);
      if (userId) {
        localStorage.setItem("userId", userId.toString());
      }
      setAutoRefresh(accessToken);
    }

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, [autoRefresh]);

  return { signup, login, SendToEmail, error, data };
};

export default useAuth;