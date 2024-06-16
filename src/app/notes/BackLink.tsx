import Link from "next/link";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Body } from "@/components/markdown";

export function BackLink({ link }: { link: string }) {
  return (
    <Link href={link} className="group flex flex-row items-center w-fit">
      <ChevronLeftIcon className="transition-all w-4 h-4 group-hover:-translate-x-1 group-hover:text-sky-500" />
      <Body className="group-hover:text-sky-500">Back</Body>
    </Link>
  );
}