'use client';

import css from './NoteForm.module.css';
import { useId } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useNoteDraftStore } from '@/lib/store/noteStore';

// interface NoteFormProps {
//   onClose?: () => void;
// }

// interface NoteFormValues {
//   title: string;
//   content: string;
//   tag: string;
// }

export default function NoteForm() {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  const handleSubmit = () => {
    mutation.mutate(draft);
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          value={draft.title}
          id={`${fieldId}-title`}
          type="text"
          name="title"
          className={css.input}
          required
          minLength={3}
          maxLength={50}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          value={draft.content}
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          required
          minLength={3}
          maxLength={200}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          value={draft.tag}
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating note...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
