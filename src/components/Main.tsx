import React from "react";

type MainProps = { children: React.ReactNode };

export const Main: React.FC<MainProps> = ({ children }) => {
    return (
        <main className="mx-auto max-w-2xl px-4">
            {children}
        </main>
    );
};
