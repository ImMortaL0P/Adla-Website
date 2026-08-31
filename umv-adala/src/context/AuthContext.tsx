import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { Profile } from '@/types/domain'

// Placeholder for Phase 4
interface AuthContextType {
  user: null
  profile: Profile | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  // Phase 1-3 implementation (No Auth)
  return (
    <AuthContext.Provider
      value={{
        user: null,
        profile: null,
        loading: false,
        signIn: async () => {},
        signOut: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
