import { useState, useEffect, createContext, useRef } from "react";
import { getUserProfileApi } from "../api";
import { useAuth } from "../hooks/useAuth";

export const UserSidebarContext = createContext();

export const UserSidebarProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const [id, setId] = useState(userId);
  const [displayData, setDisplayData] = useState(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (userId) setId(userId);
  }, [userId]);

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
