import { ReactNode } from "react";

export type ButtonColor = "blue" | "white";
export type ButtonSize = "small" | "normal";

const COLORS: Record<ButtonColor, string> = {
    "white": "border hover:bg-gray-100 text-black",
    "blue": "bg-blue-500 hover:bg-blue-600 text-white"
}

const SIZES: Record<ButtonSize, string> = {
    "normal": "px-4 py-2",
    "small": "px-2"
}

function Button({ children, color = "blue", size = "normal", bold = true, className = "", onClick }: {
    children: ReactNode,
    color?: ButtonColor,
    size?: ButtonSize,
    bold?: boolean,
    className?: string,
    onClick: () => void
}) {
    return (
        <button onClick={onClick} className={`${COLORS[color]} ${SIZES[size]} ${bold ? 'font-bold' : ''} rounded-md flex gap-2 justify-center items-center ${className}`}>{children}</button>
    );
}

export default Button;

