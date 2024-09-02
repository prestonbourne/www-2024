import React from "react";
import { notFound } from "next/navigation";
import { WorkMDXRenderer } from "@/components/markdown";
import { formatISOToDate } from "@/lib/index";
import { calculateReadingTime, getWorkBySlug, getLocalWorks } from "@/lib/work";
import { NextPageProps } from "@/lib/types";
import { TextWithIcon } from "@/components/TextWithIcon";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { Divider } from "@/components/Divider";
import { Heading } from "@/components/typography/heading";
import { Paragraph as Body } from "@/components/typography/Paragraph";
import { ClientViewCount } from "@/components/work/view-count";
import NextLink from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { cx } from "class-variance-authority";

export function generateStaticParams() {
  const works = getLocalWorks().filter((work) => work.type === "work_route");

  return works.map((work) => ({
    slug: work.slug,
  }));
}

export async function generateMetadata({ params }: NextPageProps) {
  const currentSlug = params.slug;
  const work = getWorkBySlug(currentSlug);

  if (!work) return notFound();
  const { title, description } = work.metadata;

  return {
    title,
    description,
  };
}

export default async function Page({ params }: NextPageProps) {
  const currentSlug = params.slug;
  const work = getWorkBySlug(currentSlug);

  if (!work) return notFound();

  const { metadata } = work;

  const backButtonClasses = cx(
    "flex flex-row gap-1 bg-gray-950/50 items-center w-fit px-2 py-1 rounded-lg",
    "hover:bg-gray-950/50 transition-colors",
    "shadow-inner-shine"
  )
  return (
    <article className="max-w-screen-md mx-auto mt-6">
      <div className={backButtonClasses}>
        <ArrowLeftIcon />
        <NextLink href="/">Back</NextLink>
      </div>
      <Heading level={1} >
        {metadata.title}
      </Heading>
      <Body className="text-sm py-2 text-sub-text">{metadata.description}</Body>
      <div className="flex justify-between my-2 py-0 items-center">
        <TextWithIcon
          text={formatISOToDate(metadata.publishedAt)}
          Icon={CalendarIcon}
        />
        <div className="flex gap-4 my-0 py-0 items-center">
          <TextWithIcon
            text={`${calculateReadingTime(work.content)} mins`}
            Icon={ClockIcon}
          />
          <ClientViewCount slug={work.slug} shouldIncrement />
        </div>
      </div>
      <Divider className="my-4" />

      <WorkMDXRenderer source={work.content} />
    </article>
  );
}
