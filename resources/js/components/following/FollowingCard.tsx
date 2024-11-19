import Avatar from "../base/Avatar";
import { BASE_URL, DEFAULT_AVATAR } from "../../constants";
import { UserMeta } from "../../model/user";
import { Link } from "wouter";
import Button from "../base/Button";

function FollowingCard({ user, onUnfollow }: {
    user: UserMeta,
    onUnfollow: () => void
}) {

    return (
        <div className="bg-white p-4 border rounded-md w-72 flex-col flex items-center">
            <div className="flex justify-center">
                <Avatar image={`${BASE_URL}/storage/avatars/${user.avatar ?? DEFAULT_AVATAR}`}
                    customClass="w-32 h-32" />
            </div>
            <div>
                <Link to={`profile/${user.username}`} className={"text-xl mt-4 text-blue-500"}>{user.name}</Link>
                <p className="text-sm text-gray-500">@{user.username}</p>
            </div>

            <Button className="mt-4" onClick={onUnfollow}>Unfollow</Button>
        </div>
    );

};

export default FollowingCard;

