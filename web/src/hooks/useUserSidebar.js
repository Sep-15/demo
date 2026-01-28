import { useContext } from "react";
import { UserSidebarContext } from "../contexts/UserSidebarContext";

export const useUserSidebar = () => useContext(UserSidebarContext);
