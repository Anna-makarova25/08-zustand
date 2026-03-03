'use client';

import css from './NotesPage.module.css';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import NoteForm from '@/components/NoteForm/NoteForm';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Loader from '@/components/Loader/Loader';
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { useDebouncedCallback } from 'use-debounce';

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSearch = useDebouncedCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, 500);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ['notes', searchQuery, page, tag],
    queryFn: () => fetchNotes(searchQuery, page, 12, tag === 'all' ? '' : tag),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox onSearch={handleSearch} />}
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        {
          <button className={css.button} onClick={() => setIsFormOpen(true)}>
            Create note +
          </button>
        }
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && notes.length > 0 && <NoteList notes={notes} />}
      {isFormOpen && (
        <Modal onClose={() => setIsFormOpen(false)}>
          <NoteForm onClose={() => setIsFormOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
