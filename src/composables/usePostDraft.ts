// src/composables/usePostDraft.ts
import { reactive } from 'vue';

export interface PostDraft {
  title: string;
  body: string;
  userId: number | null;
}

// Interfaz para el tipo de retorno explícito del composable
export interface UsePostDraftReturn {
  draft: PostDraft;
  setDraft: (data: Partial<PostDraft>) => void;
  clearDraft: () => void;
}

// Estado compartido a nivel de módulo
const draft = reactive<PostDraft>({
  title: '',
  body: '',
  userId: null,
});

// Se declara ': UsePostDraftReturn' como tipo de retorno
export function usePostDraft(): UsePostDraftReturn {
  function setDraft(data: Partial<PostDraft>): void {
    if (data.title !== undefined) draft.title = data.title;
    if (data.body !== undefined) draft.body = data.body;
    if (data.userId !== undefined) draft.userId = data.userId;
  }

  function clearDraft(): void {
    draft.title = '';
    draft.body = '';
    draft.userId = null;
  }

  return {
    draft,
    setDraft,
    clearDraft,
  };
}