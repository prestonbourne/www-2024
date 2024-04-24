import React from "react";

type HeaderProps = { children: React.ReactNode };

export const Header: React.FC<HeaderProps> = ({ children }) => {
    return (
        <header className="mx-auto max-w-2xl py-2 px-4">
            {children}
        </header>
    );
};