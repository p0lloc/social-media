import { useEffect, useRef } from "react";

function FileInput({ onChange, mimeType = "image/png, image/jpeg" }: {
    onChange: (f: File | null) => void,
    mimeType?: string
}) {
    const fileInput = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        fileInput.current?.addEventListener("cancel", () => onChange(null));
        fileInput.current?.click();
    });

    function onFileChange() {
        const files = fileInput.current?.files;
        if (files == null || files.length < 1) {
            onChange(null);
            return;
        }

        onChange(files[0]);
    }

    return (
        <input ref={fileInput} type="file" className="hidden" accept={mimeType} onChange={onFileChange} />
    );
};

export default FileInput;

