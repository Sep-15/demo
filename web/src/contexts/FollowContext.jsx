import { createContext, useState, useContext } from "react";

export const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const [followMap, setFollowMap] = useState({});
  const setFollowing = (id, value) => {
    setFollowMap((p) => ({ ...p, [id]: value }));
  };
  return (
    <FollowContext.Provider value={{ followMap, setFollowing }}>
      {children}
    </FollowContext.Provider>
  );
};
