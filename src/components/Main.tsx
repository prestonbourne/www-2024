import React from "react";

type MainProps = { children: React.ReactNode } & React.HTMLProps<HTMLDivElement>;

export const Main: React.FC<MainProps> = ({ children, className='' }) => {
    return (
        <main className={`mx-auto max-w-3xl ${className}`}>
            {children}
        </main>
    );
};