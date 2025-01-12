import React from "react";

interface InputProps {
    id: string;
    type: string;
    placeholder: string;
    label: string;
}

export const AuthInputComponent: React.FC<InputProps> = ({ id, type, placeholder, label }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-blue-900">
            {label}
        </label>
        <input id={id} type={type} placeholder={placeholder} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
    </div>
);
