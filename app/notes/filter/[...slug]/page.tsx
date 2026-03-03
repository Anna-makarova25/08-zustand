import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0];

  return {
    title: `Notes with ${tag} tag`,
    description: 'Browse notes tagged with ' + tag,
    openGraph: {
      title: `Notes with ${tag} tag`,
      description: 'Browse notes tagged with ' + tag,
      url:
        'https://07-routing-nextjs-jh87nnfbh-anna-stukalovas-projects.vercel.app/notes/filter/' +
        tag,
      images: [{ url: '/public/NoteHub image.png' }],
    },
  };
}

export default async function Notes({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, tag],
    queryFn: () => fetchNotes('', 1, 12, tag === 'all' ? '' : tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
