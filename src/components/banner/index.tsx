import Image from "next/image";
import { Canvas } from "./Canvas";
import srcImg from "../../../public/headshot_bw.png";

export const Photo: React.FC = () => {
  return (
    <div className="relative top-16 mb-8 shadow-md">
      <Image
        placeholder="blur"
        src={srcImg}
        alt="Headshot of Preston Bourne"
        className="object-cover absolute top-0 left-0 rounded-lg w-20 h-20 shadow-dense"
      />
    </div>
  );
};

export const Banner: React.FC = () => {
  return (
    <>
    <div className="w-screen absolute top-0 left-0 -z-50 max-h-32 overflow-hidden">
      <Canvas />
    </div>
    <div className="w-screen h-32">
    
    </div>
    </>
  );
};
