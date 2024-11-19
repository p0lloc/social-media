import { ReactNode, useRef, MouseEvent, useEffect } from "react";

function Modal({ open, children, onClose }: { open: boolean, children: ReactNode, onClose: () => void }) {

    const modalRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement != null) {
            if (open) {
                modalElement.showModal();
            } else {
                modalElement.close();
            }
        }
    }, [open]);

    function onMouseDown(e: MouseEvent<HTMLDialogElement>) {
        if (e.target == modalRef.current) {
            onClose();
        }
    }

    return (
        <dialog ref={modalRef} onMouseDown={onMouseDown}>
            <div className="p-8">
                {children}
            </div>
        </dialog>
    );
};

export default Modal;