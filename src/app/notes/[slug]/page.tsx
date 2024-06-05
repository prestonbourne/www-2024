import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/markdown';
import { getNoteBySlug } from '../utils';

export default function Blog({ params }: { params: any }) {
  const note = getNoteBySlug(params.slug);
  if (!note) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 lg:px-20 pt-4 md:pt-10">
      <div className="flex flex-row space-x-4 mb-6 text-sm text-secondaryDarker">
       
        
      </div>
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {note.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <div className="flex flex-row space-x-2 items-center text-secondaryDarker">
          <span>{note.metadata.publishedAt}</span>
        </div>
      </div>
      <article className="prose prose-invert pb-10">
        <CustomMDX source={note.content} />
      </article>
    </div>
  );
}