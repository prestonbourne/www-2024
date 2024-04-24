import React from "react";

type MainProps = { children: React.ReactNode };

export const Main: React.FC<MainProps> = ({ children }) => {
    return (
        <main className="mx-auto max-w-3xl px-4 py-2">
            {children}
        </main>
    );
};
