import { KyInstance } from "ky";
import { http } from "../util/http";
import { ProfileResponse } from "../model/user";

export class UserService {

    private httpClient: KyInstance = http("/api/user");

    async getUserByUsername(username: string): Promise<ProfileResponse | null> {
        try {
            let user = await this.httpClient.get(`${username}`)
            return user.json();
        } catch (ex) {
            return null;
        }
    }

    async updateAvatar(file: File): Promise<string> {
        const formData = new FormData();
        if (file != null)
            formData.append("image", file);

        return await this.httpClient.post("avatar", {
            body: formData
        }).text();
    }

    async updateBanner(file: File): Promise<string> {
        const formData = new FormData();
        if (file != null)
            formData.append("image", file);

        return await this.httpClient.post("banner", {
            body: formData
        }).text();
    }

    async updateDescription(v: string) {
        return (await this.httpClient.post("description", {
            body: v
        })).ok;
    }

}