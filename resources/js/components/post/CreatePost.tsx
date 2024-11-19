import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "../base/Avatar";
import { faImage, faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";
import UploadImageModal from "./UploadImageModal";
import { useContext, useState } from "react";
import { postService } from "../../bootstrap";
import { Post, PostResponse } from "../../model/post";
import Button from "../base/Button";
import { BASE_URL, DEFAULT_AVATAR } from "../../constants";
import { authContext } from "../../context/auth";

function CreatePost({ onPostCreated }: { onPostCreated: (p: PostResponse) => void }) {

    const [imageUploadModal, setImageUploadModal] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [caption, setCaption] = useState("");

    const auth = useContext(authContext);

    function onFileClose(file: File | null) {
        setImageUploadModal(false);

        if (file != null) {
            setImageFile(file);
        }
    }

    async function post() {
        let post = await postService.createPost(caption, imageFile);

        setImageFile(null);
        setCaption("");
        onPostCreated(post);
    }

    return (
        <div className="bg-white p-4 border rounded-md flex gap-4">
            <Avatar image={`${BASE_URL}/storage/avatars/${auth.authenticatedUser?.avatar ?? DEFAULT_AVATAR}`} customClass="w-16 h-16" />
            <div className="flex-1">
                <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="bg-gray-100 w-full p-4 h-28 rounded-md" placeholder="What's on your mind?">

                </textarea>
                <div className="flex justify-between flex-col md:flex-row gap-2 md:gap-0 mt-2">
                    <div className="flex items-center gap-2">
                        <Button color="white" bold={false} size="small" onClick={() => setImageUploadModal(true)}>
                            <FontAwesomeIcon icon={faImage} className="text-blue-400" />
                            {imageFile != null ? imageFile.name : 'Add image'}
                        </Button>
                        {imageFile != null ?
                            <button>
                                <FontAwesomeIcon onClick={() => setImageFile(null)} icon={faTimes} />
                            </button> : null}
                    </div>
                    <Button onClick={post}>
                        Post
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                </div>
            </div>

            <UploadImageModal open={imageUploadModal} onClose={onFileClose} />
        </div>
    );
};

export default CreatePost;