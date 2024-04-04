"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const Heading = ({ labels }: { labels: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const durationMS = 2400;
    const framerDuration = durationMS / 1000 / 10;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % labels.length);
        }, durationMS);

        return () => clearInterval(interval);
    }, [setCurrentIndex, labels.length]);

    return (
        <section className="relative">
            <h1 className="text-5xl font-bold">Preston Bourne</h1>
            <h2 className="text-2xl font-medium">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={currentIndex}
                        initial={{ y: -140, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{
                            duration: framerDuration,
                            type: "spring",
                            stiffness: 80,
                        }}
                        className="inline-block w-28 text-sky-600"
                    >
                        {labels[currentIndex]}
                    </motion.span>
                </AnimatePresence>
                Engineer
            </h2>
        </section>
    );
};

const NameHeading = ({ name }: { name: string }) => {
    return;
};
