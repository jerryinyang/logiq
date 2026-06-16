import { create } from 'zustand'

interface UserStoreState {
  id: string | null
  setUser: (id: string) => void
  clearUser: () => void
}

export const useUserStore = create<UserStoreState>()((set) => ({
  id: null,
  setUser: (id: string) => set({ id }),
  clearUser: () => set({ id: null }),
}))
