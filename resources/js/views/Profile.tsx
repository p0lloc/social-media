import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { followService, userService } from "../bootstrap";
import { ProfileResponse } from "../model/user";
import ProfileAvatar from "../components/profile/ProfileAvatar";
import ProfileBanner from "../components/profile/ProfileBanner";
import { authContext } from "../context/auth";
import Button from "../components/base/Button";
import AboutMe from "../components/profile/AboutMe";
import PostList from "../components/post/PostList";

function Profile() {

    const params = useParams();
    const [user, setUser] = useState<ProfileResponse | null>(null);

    const [followId, setFollowId] = useState<string | null>(null);
    const [_, setLocation] = useLocation();

    const auth = useContext(authContext);

    useEffect(() => {
        loadUser();
    }, [params]); // Fetch a different profile if the username changes

    useEffect(() => {
        // Check if the user is following the profile that they are viewing.
        loadFollow();
    }, [user, auth.authenticatedUser]); // We need to make sure that the profile and the authenticated user is fetched first.

    async function loadUser() {
        let user = await userService.getUserByUsername(params.username!);
        if (user == null) return;

        setUser(user);
    }

    async function loadFollow() {
        if (user == null || auth.authenticatedUser == null) return;

        if (!isSelf()) {
            setFollowId(await followService.getFollowing(user.id));
        }
    }

    async function onAvatarChanged(f: File) {
        let avatar = await userService.updateAvatar(f);
        setUser(user => {
            if (user == null) return user;
            return { ...user, avatar };
        });

        if (auth.authenticatedUser != null) {
            auth.authenticatedUser.avatar = avatar;
        }
    }

    async function onBannerChanged(f: File) {
        let banner = await userService.updateBanner(f);
        setUser(user => {
            if (user == null) return user;
            return { ...user, banner };
        });
    }

    async function updateDescription(v: string) {
        await userService.updateDescription(v);
        setUser(user => {
            if (user == null) return user;
            return { ...user, description: v };
        });
    }

    function isSelf() {
        return auth.authenticatedUser?.username == user?.username;
    }

    async function toggleFollow() {
        if (user == null) return;

        if (followId == null) {
            let follow = await followService.followUser(user.id);
            setFollowId(follow.id);
        } else {
            await followService.deleteFollow(followId);
            setFollowId(null);
        }
    }

    function settingsPage() {
        setLocation("/settings");
    }

    return (user != null ?
        <div className="main-center mt-8">

            <div className="relative">
                <ProfileBanner onChange={onBannerChanged} self={isSelf()} banner={user.banner} />
                <ProfileAvatar onChange={onAvatarChanged} self={isSelf()} avatar={user.avatar} />
            </div>
            <div
                className={
                    "w-full bg-white rounded-b-md border-b p-2 flex flex-col md:flex-row gap-2 justify-between items-center"
                }
            >
                <div className={"flex items-center gap-2 pl-4"}>
                    <b className={"text-2xl"}>{user.name}</b>
                    <p className={"text"}>(@{user.username})</p>
                </div>

                {!isSelf() && auth.authenticatedUser != null ? <Button onClick={toggleFollow}>{followId != null ? "Unfollow" : "Follow"}</Button> : <Button onClick={settingsPage}>Settings</Button>}
            </div>

            <div className={"flex flex-col md:flex-row mt-4 md:mt-24 gap-8"}>
                <div className={"flex flex-col gap-4 w-full md:w-[19rem]"}>
                    <AboutMe onChange={updateDescription} self={isSelf()} description={user.description} />
                </div>

                <div className={"flex-1 mb-4"}>
                    <h2 className={"text-3xl font-bold mb-4"}>Posts</h2>

                    <PostList canPost={isSelf()} user={user.id} />
                </div>
            </div>
        </div> : null);
}

export default Profile;