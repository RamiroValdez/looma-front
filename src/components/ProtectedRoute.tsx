import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/AuthStore'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}