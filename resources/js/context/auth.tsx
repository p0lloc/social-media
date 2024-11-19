import { createContext, ReactNode, useEffect, useState } from "react";
import { UserDetails } from "../services/auth";
import { authService } from "../bootstrap";

export interface AuthContext {
    authenticatedUser: UserDetails | null;
    loaded: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

export const authContext = createContext<AuthContext>({} as AuthContext);

export const AuthProvider = (props: { children: ReactNode }) => {
    const [authenticatedUser, setAuthenticatedUser] = useState<UserDetails | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadAuthenticatedUser();
    }, []);

    const loadAuthenticatedUser = async () => {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
            credentials: "include"
        });

        const user = await authService.loadUser();
        setAuthenticatedUser(user);
        setLoaded(true);
    }

    const login = async (email: string, password: string) => {
        const user = await authService.loginWithPassword(email, password);
        setAuthenticatedUser(user);

        return user != null;
    }

    const register = async (email: string, password: string) => {
        return await authService.register(email, password);
    }

    const resetPassword = async (email: string) => {
        await authService.resetPassword(email);
    }

    const logout = async () => {
        await authService.logout();
        setAuthenticatedUser(null);
    }

    return (
        <authContext.Provider value={{ authenticatedUser, loaded, register, login, logout, resetPassword }}>
            {props.children}
        </authContext.Provider>
    )
};