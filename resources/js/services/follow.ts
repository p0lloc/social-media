import { KyInstance } from "ky";
import { http } from "../util/http";
import { Follow, FollowResponse } from "../model/follow";

export class FollowService {

    private httpClient: KyInstance = http("/api/follows");


    async getFollows(): Promise<FollowResponse[]> {
        return this.httpClient.get("").json();
    }

    async followUser(userId: string): Promise<Follow> {
        return this.httpClient.post("", {
            json: {
                to_id: userId
            }
        }).json();
    }

    async deleteFollow(id: string): Promise<boolean> {
        return (await this.httpClient.delete(id)).ok;
    }

    async getFollowing(id: string) {
        try {
            let result = this.httpClient.get(`following/${id}`);
            return await result.text();
        } catch (e) {
            return null;
        }
    }

}