import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'
import { toast } from 'react-hot-toast'
import { disconnectSocket, initializeSocket } from '../socket/socket.client'

export const useAuthStore = create((set) => ({
    authUser: null,
    checkingAuth: true,
    loading: false,

    signup: async (signupData) => {
        try {
            set({ loading: true })
            const res = await axiosInstance.post('/auth/signup', signupData)
            initializeSocket(res.data.user._id)
            set({ authUser: res.data.user})
            toast.success('Signup successful')
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong")
        } finally {
            set({ loading: false })
        }
    },

    login: async (loginData) => {
        try {
            set({ loading: true })
            const res = await axiosInstance.post('/auth/login', loginData)
            initializeSocket(res.data.user._id)
            set({ authUser: res.data.user})
            toast.success('Login successful')
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong")
        } finally {
            set({ loading: false })
        }
    },

    logout: async() => {
        try {
            set({ loading: true })
            const res = await axiosInstance.post('/auth/logout')
            disconnectSocket()
            if(res.status === 200) set({ authUser: null })
            toast.success('Logout successful')
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong")
        } finally {
            set({ loading: false })
        }
    },

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get('/auth/me')
            set({ authUser: res.data.user })
            initializeSocket(res.data.user._id)
        } catch (error) {
            set({ authUser: null })
            console.log(error)
        } finally {
            set({ checkingAuth: false })
        }
    },

    setAuthUser: (user) => set({ authUser: user }),
}))