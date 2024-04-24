import React from "react";

type CenterProps = { children: React.ReactNode };

export const Center: React.FC<CenterProps> = ({ children }) => {
    return (
        <div className="mx-auto max-w-2xl px-4 py-2">
            {children}
        </div>
    );
};