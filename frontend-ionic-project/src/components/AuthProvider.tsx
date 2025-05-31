import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

interface AuthContextType {
  user: any; // Puedes definir una interfaz más detallada para tu usuario
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Intenta cargar el usuario del localStorage al iniciar la app
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setIsLoading(false); // Deja de cargar después de verificar el usuario
    }, []);

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const userData = await authService.login(email, password);
            setUser(userData);
        } catch (error) {
            console.error('Error durante el login:', error);
            throw error; // Re-lanza para que el componente de login pueda manejarlo
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (userData: any) => {
        setIsLoading(true);
        try {
            const registeredUser = await authService.register(userData);
            setUser(registeredUser);
        } catch (error) {
            console.error('Error durante el registro:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login: handleLogin, register: handleRegister, logout: handleLogout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};