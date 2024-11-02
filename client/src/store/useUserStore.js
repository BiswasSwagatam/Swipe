import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useUserStore = create((set) => ({
    loading: false,

    updateProfile: async (updateData) => {
        try {
            set({ loading: true });
            const res = await axiosInstance.put("/users/update", updateData);
            useAuthStore.getState().setAuthUser(res.data.user);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ loading: false });
        }
    },
}))