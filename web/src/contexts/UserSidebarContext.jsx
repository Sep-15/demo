import { useState, useEffect, createContext, useRef } from "react";
import { getUserProfileApi } from "../api";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "react-router-dom";

export const UserSidebarContext = createContext();

export const UserSidebarProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const [id, setId] = useState(userId);
  const [displayData, setDisplayData] = useState(null);
  const requestIdRef = useRef(0);
  const location = useLocation();

  useEffect(() => {
    if (userId) setId(userId);
  }, [userId]);

  useEffect(() => {
    const is =
      location.pathname.startsWith("/posts/") ||
      location.pathname.startsWith("/profile/");
    if (!is && userId && id !== userId) {
      setId(userId);
    }
  }, [location.pathname, userId]);

  useEffect(() => {
    if (!id) return;
    const reqId = ++requestIdRef.current;
    getUserProfileApi(id)
      .then(({ data }) => {
        if (reqId === requestIdRef.current) {
          setDisplayData(data);
        }
      })
      .catch(console.error);
  }, [id]);

  const showUser = (targetId) => setId(targetId);

  return (
    <UserSidebarContext.Provider value={{ displayData, showUser }}>
      {children}
    </UserSidebarContext.Provider>
  );
};
