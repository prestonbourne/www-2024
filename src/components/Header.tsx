import React from "react";

type HeaderProps = { children: React.ReactNode } & React.HTMLProps<HTMLDivElement>;

export const Header: React.FC<HeaderProps> = ({ children, className }) => {
    return (
        <header className={`mx-auto max-w-2xl py-2 px-4 ${className}`}>
            {children}
        </header>
    );
};