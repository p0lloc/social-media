import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BASE_URL, DEFAULT_BANNER } from "../../constants";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import FileInput from "../base/FileInput";
import { useState } from "react";

function ProfileBanner({ banner, self, onChange }: {
    banner: string | null,
    self: boolean,
    onChange: (f: File) => void
}) {

    const [filePickerOpen, setFilePickerOpen] = useState(false);

    function openFilePicker() {
        setFilePickerOpen(true);
    }

    function onChangeBanner(f: File | null) {
        if (f != null)
            onChange(f);

        setFilePickerOpen(false);
    }

    return (
        <div className={"container"}>
            {filePickerOpen ? <FileInput onChange={onChangeBanner} /> : null}
            {self ? <button onClick={openFilePicker} className={"container-child"}>
                <div className={"mt-8 right-8 absolute bottom-8"}>
                    <FontAwesomeIcon icon={faPen} />
                </div>
            </button> : null}
            <img
                src={
                    `${BASE_URL}/storage/banners/${banner ?? DEFAULT_BANNER}`
                }
                className={"h-52 object-cover w-full rounded-t-md"}
                alt={"User banner"}
            />
        </div>);
}

export default ProfileBanner;

