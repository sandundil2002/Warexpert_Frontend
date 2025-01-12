import React from "react";

interface ImageProps {
    src: string;
    alt: string;
}

export const AuthImageComponent: React.FC<ImageProps> = ({ src, alt }) => (
    <div className="w-1/2 hidden md:block">
        <img src={src} alt={alt} className="h-full w-full object-cover"/>
    </div>
);
