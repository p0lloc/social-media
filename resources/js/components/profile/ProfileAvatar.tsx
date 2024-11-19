import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BASE_URL, DEFAULT_AVATAR } from "../../constants";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import FileInput from "../base/FileInput";

function ProfileAvatar({ avatar, self, onChange }: {
    avatar: string | null,
    self: boolean,

    onChange: (f: File) => void
}) {

    const [filePickerOpen, setFilePickerOpen] = useState(false);

    function openFilePicker() {
        setFilePickerOpen(true);
    }

    function onChangeAvatar(f: File | null) {
        if (f != null)
            onChange(f);

        setFilePickerOpen(false);
    }

    return (<div
        className={
            "absolute bottom-[20px] md:bottom-[-80px] left-1/2 border-4 border-blue-100 rounded-full container w-32 h-32"
        }
        style={{ transform: "translateX(-50%)" }}
    >
        {filePickerOpen ? <FileInput onChange={onChangeAvatar} /> : null}
        {self ? <button onClick={openFilePicker} className="container-child rounded-full flex justify-center items-center">
            <FontAwesomeIcon icon={faPlus} />
        </button> : null}
        <img
            src={
                `${BASE_URL}/storage/avatars/${avatar ?? DEFAULT_AVATAR}`
            }
            className={"object-cover rounded-full w-full h-full"}
            alt={"Avatar"} />
    </div>);
}

export default ProfileAvatar;

