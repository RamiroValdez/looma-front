import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
    token: string | null
    isAuthenticated: boolean
    setToken: (token: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            isAuthenticated: false,
            setToken: (token: string) => set({ token, isAuthenticated: true }),
            logout: () => set({ token: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
            storage: {
                getItem: (name) => {
                    const str = sessionStorage.getItem(name)
                    return str ? JSON.parse(str) : null
                },
                setItem: (name, value) => {
                    sessionStorage.setItem(name, JSON.stringify(value))
                },
                removeItem: (name) => sessionStorage.removeItem(name),
            },
        }
    )
)