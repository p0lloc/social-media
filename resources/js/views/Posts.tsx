import { useContext } from "react";
import { authContext } from "../context/auth";
import PostList from "../components/post/PostList";

function Posts() {
    const auth = useContext(authContext);

    return (
        <div className="main-center">
            <PostList canPost={auth.authenticatedUser != null} />
        </div>
    )

}

export default Posts;