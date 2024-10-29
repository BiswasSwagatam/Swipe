import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUserStore = create((set) => ({
    loading: false,

    updateProfile: async (updateData) => {
        try {
            set({ loading: true });
            await axiosInstance.put("/users/update", updateData);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ loading: false });
        }
    },
}))