import { KyInstance } from "ky";
import { http } from "../util/http";

export interface UserDetails {
    username: string;
    email: string;
    avatar: string;
}

export class AuthService {

    private httpClient: KyInstance = http("/auth");
    public user: UserDetails | null = null;

    async loginWithPassword(email: string, password: string): Promise<UserDetails | null> {
        try {
            await this.httpClient.post("login", {
                json: {
                    email,
                    password
                }
            });

            return await this.loadUser();
        } catch (_) {
            return null;
        }
    }

    async loadUser(): Promise<UserDetails | null> {
        try {
            this.user = await this.httpClient.get("user").json();
            return this.user;
        } catch (_) {
            return null;
        }
    }

    async register(email: string, password: string): Promise<boolean> {
        try {
            return (await this.httpClient.post("register", {
                json: {
                    email,
                    password
                }
            })).ok;
        } catch (_) {
            return false;
        }
    }

    async resetPassword(email: string): Promise<boolean> {
        try {
            return (await this.httpClient.post("initReset", {
                json: {
                    email,
                }
            })).ok;
        } catch (_) {
            return false;
        }
    }

    async setPassword(previous: string, newPassword: string): Promise<boolean> {
        try {
            return (await this.httpClient.post("password", {
                json: {
                    previous,
                    new: newPassword
                }
            })).ok;
        } catch (_) {
            return false;
        }
    }

    async logout() {
        await this.httpClient.post("logout");
    }

}