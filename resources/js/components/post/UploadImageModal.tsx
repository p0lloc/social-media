import { useRef } from "react";
import Modal from "../base/Modal";
import Button from "../base/Button";

function UploadImageModal({ open, onClose }: { open: boolean, onClose: (file: File | null) => void }) {

    const fileInput = useRef<HTMLInputElement | null>(null);

    function openFilePicker() {
        fileInput.current?.click();
    }

    function onFileChange() {
        const files = fileInput.current?.files;
        if (files == null || files.length < 1) return;

        onClose(files[0]);
    }

    return (
        <Modal open={open} onClose={() => onClose(null)}>
            <h2 className="text-2xl font-bold">Upload file</h2>
            <div className="flex justify-center items-center">
                <input ref={fileInput} type="file" className="hidden" onChange={onFileChange} />
                <Button color="white" onClick={openFilePicker} className="mt-4 w-52 h-52 text-3xl">
                    +
                </Button>
            </div>
        </Modal>
    );
};

export default UploadImageModal;