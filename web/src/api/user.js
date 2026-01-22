import apiClient from "../api/axios";

export const profileApi = (userId) => apiClient.get(`/users/${userId}`);
