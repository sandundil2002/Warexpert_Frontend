import React from "react";

interface ButtonProps {
    type: "button" | "submit";
    text: string;
    additionalClasses?: string;
    icon?: string;
}

export const AuthButtonComponent: React.FC<ButtonProps> = ({ type, text, additionalClasses = "", icon }) => (
    <button type={type}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${additionalClasses}`}>
        {icon && <img src={icon} className="mx-2" alt="icon" />}
        {text}
    </button>
);
