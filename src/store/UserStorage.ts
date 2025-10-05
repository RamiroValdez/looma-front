import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    userId: number;
    email: string;
    name: string;
    surname: string;
    username: string;
}

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
    updateUser: (updates: Partial<User>) => void;
    clearUser: () => void;
    hasUser: () => boolean;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: null,

            setUser: (user: User) => set({ user }),

            updateUser: (updates: Partial<User>) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null
                })),

            clearUser: () => set({ user: null }),

            hasUser: () => get().user !== null,
        }),
        {
            name: 'user-storage',
            getStorage: () => localStorage,
        }
    )
);

export type { User };