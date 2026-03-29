import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';


interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loginUser: (user: User) => void;
    logoutUser: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('amazon_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const loginUser = (user: User) => {
        setUser(user);
        localStorage.setItem('amazon_user', JSON.stringify(user));
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('amazon_user');
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
