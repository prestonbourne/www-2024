import React from "react";
import { Canvas } from "@/components/Canvas";
import Image from "next/image";
import { Center } from "@/components/Center";
import srcImg from "../../../public/headshot_bw.png"


const Photo: React.FC = () => {
    return (
        <div className="bg-gray-200 relative -top-28">
            <Image
                placeholder="blur"
                src={srcImg}
                alt="Headshot of Preston Bourne"
                className="object-cover absolute top-0 left-0 rounded-md w-28 h-28"
                width={112}
                height={112}
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
