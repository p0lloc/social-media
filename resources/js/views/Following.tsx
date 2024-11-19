import { useContext, useEffect, useState } from "react";
import { FollowResponse } from "../model/follow";
import { authContext } from "../context/auth";
import { followService } from "../bootstrap";
import FollowingCard from "../components/following/FollowingCard";

function Following() {

    const [follows, setFollows] = useState<FollowResponse[]>([]);

    const auth = useContext(authContext);

    useEffect(() => {
        if (auth.authenticatedUser == null) return;
        loadFollows();
    }, [auth.authenticatedUser]);

    async function loadFollows() {
        setFollows(await followService.getFollows());
    }

    async function onUnfollow(id: string) {
        await followService.deleteFollow(id);
        setFollows(follows.filter((f) => f.follow.id != id));
    }

    return (
        <div className="main-center text-center">
            <h1 className="text-3xl font-bold my-8">Users you follow</h1>

            {auth.authenticatedUser != null ? <div className="grid grid-cols-1 justify-items-center md:justify-items-start md:grid-cols-3 gap-4">
                {follows.length > 0 ? follows.map((f) => <FollowingCard onUnfollow={() => onUnfollow(f.follow.id)} key={f.follow.id} user={f.user} />) : <p>You don't follow anyone yet.</p>}
            </div> : <p>You need to log in to see your followed users.</p>}
        </div>
    );
}

export default Following;