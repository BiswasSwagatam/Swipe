import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";



export const useMessageStore = create((set) => ({
    messages: [],
    loading: true,

    sendMessage: async (receiverId, content) => {
        try {
            set((state) => ({
                messages: [...state.messages, {
                    _id: Date.now(),
                    sender: useAuthStore.getState().authUser._id,
                    content: content}]
            }))
            const res = await axiosInstance.post('/messages/send', {receiverId, content})
            console.log("message sent",res.data)
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong")
        }
    },

    getMessages: async (userId) => {
        try {
            set({ loading: true })
            const res = await axiosInstance.get(`/messages/conversation/${userId}`)
            set({ messages: res.data.messages})
            console.log("messages", res.data)
        } catch (error) {
            console.log(error)
            set({ messages: [] })
        } finally {
            set({ loading: false })
        }
    },

    subscribeToMessages: () => {
        try {
            const socket = getSocket()

            socket.on("newMessage", ({message}) => {
                set((state) => ({
                    messages: [...state.messages, message]
                }))
                toast.success("You got a new message!")
            })
        } catch (error) {
            console.log(error)
        }
    },

    unsubscribeFromMessages: () => {
        try {
            const socket = getSocket()
            socket.off("newMessage")
        } catch (error) {
            console.log(error)
        }
    }
}))