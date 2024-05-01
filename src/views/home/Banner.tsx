import React from "react";
import { Canvas } from "@/components/Canvas";
import Image from "next/image";
import { Center } from "@/components/Center";
import srcImg from "../../../public/headshot_bw.png"


const Photo: React.FC = () => {
    return (
        <div className="bg-gray-200 relative -top-12 mb-8 lg:-top-16">
            <Image
                placeholder="blur"
                src={srcImg}
                alt="Headshot of Preston Bourne"
                className="object-cover absolute top-0 left-0 rounded-lg w-20 h-20 lg:w-24 lg:h-24 border border-slate-50"
            />
        </div>
    );
};

export const Banner: React.FC = () => {
    return (
        <>
            <div className="max-h-32 overflow-clip">
                <Canvas />
            </div>
            <Center>
                <Photo />
            </Center>
        </>
    );
};
