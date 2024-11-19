import { useContext } from "react";
import { Link, useLocation } from "wouter";
import { authContext } from "../../context/auth";
import Button from "../base/Button";
import Avatar from "../base/Avatar";
import { BASE_URL, DEFAULT_AVATAR } from "../../constants";

function Navbar() {

    const auth = useContext(authContext);
    const [_, setLocation] = useLocation();

    return (
        <div className="bg-white py-4 px-2 md:px-0">
            <div className="main-center flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-blue-500">
                        <Link href="/">VibeShare</Link>
                    </h2>
                    <Link href="/">Feed</Link>
                    <Link href="/following">Following</Link>
                </div>
                <div>
                    {auth.authenticatedUser != null
                        ? <Link to={`/profile/${auth.authenticatedUser.username}`}>
                            <Avatar
                                image={`${BASE_URL}/storage/avatars/${auth.authenticatedUser.avatar ?? DEFAULT_AVATAR}`}
                                customClass="w-10 h-10" />
                        </Link>
                        : <Button onClick={() => setLocation("/login")} >Log in</Button>
                    }
                </div>
            </div>
        </div>
    );
}

export default Navbar;