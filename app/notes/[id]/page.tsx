import { fetchNoteById } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const note = await fetchNoteById(id);
  const tag = note.tag[0] || 'untagged';

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

export default async function NoteDetails({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
