import { KyInstance } from "ky";
import { http } from "../util/http";
import { Like } from "../model/like";

export class LikeService {

    private httpClient: KyInstance = http("/api/likes");

    async likePost(postId: string): Promise<Like> {
        return (await this.httpClient.post("", {
            json: {
                post_id: postId
            }
        })).json();
    }

    async unlikePost(likeId: string): Promise<boolean> {
        return (await this.httpClient.delete(likeId)).ok;
    }

}