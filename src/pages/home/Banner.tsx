import React from "react";
import { Canvas } from "@/components/Canvas";
import Image from "next/image";
import { Center } from "@/components/Center";
import srcImg from "../../../public/headshot_bw.png"


const Photo: React.FC = () => {
    return (
        <div className="w-28 h-28 rounded-md bg-gray-200 absolute top-56 border-solid border-4 border-slate-50 overflow-clip">
            <Image
                placeholder="blur"
                src={srcImg}
                alt="Get Out"
                className="w-full h-full object-cover"
                fill
            />
        </div>
    );
};

export const Banner: React.FC = () => {
    return (
        <>
            <div className="bg-gray-200 max-h-72 mb-8">
                <Canvas />
            </div>
            <Center>
                <Photo />
            </Center>
        </>
    );
};
