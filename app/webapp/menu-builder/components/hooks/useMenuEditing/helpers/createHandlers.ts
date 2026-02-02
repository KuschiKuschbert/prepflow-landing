/**
 * Create handler functions for menu editing.
 */
import type { Menu } from '@/lib/types/menu-builder';

interface TitleEditingHandler {
  handleStartEditTitle?: (menu: Menu, e: React.MouseEvent) => void;
  handleCancelEdit: () => void;
  handleSaveTitle: (menu: Menu) => void;
  handleTitleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, menu: Menu) => void;
}

interface DescriptionEditingHandler {
  handleStartEditDescription?: (menu: Menu, e: React.MouseEvent) => void;
  handleCancelEdit: () => void;
  handleSaveDescription: (menu: Menu) => void;
  handleDescriptionKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

interface EditingRefs {
  titleEditingRef: React.MutableRefObject<TitleEditingHandler>;
  descriptionEditingRef: React.MutableRefObject<DescriptionEditingHandler>;
}

export function createHandlers(refs: EditingRefs) {
  const handleStartEditTitle = (menu: Menu, e: React.MouseEvent) =>
    refs.titleEditingRef.current?.handleStartEditTitle?.(menu, e);
  const handleStartEditDescription = (menu: Menu, e: React.MouseEvent) =>
    refs.descriptionEditingRef.current?.handleStartEditDescription?.(menu, e);
  const handleCancelEdit = () => {
    refs.titleEditingRef.current?.handleCancelEdit();
    refs.descriptionEditingRef.current?.handleCancelEdit();
  };
  const handleSaveTitle = (menu: Menu) => refs.titleEditingRef.current?.handleSaveTitle(menu);
  const handleSaveDescription = (menu: Menu) =>
    refs.descriptionEditingRef.current?.handleSaveDescription(menu);
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, menu: Menu) =>
    refs.titleEditingRef.current?.handleTitleKeyDown?.(e, menu);
  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) =>
    refs.descriptionEditingRef.current?.handleDescriptionKeyDown?.(e);

  return {
    handleStartEditTitle,
    handleStartEditDescription,
    handleCancelEdit,
    handleSaveTitle,
    handleSaveDescription,
    handleTitleKeyDown,
    handleDescriptionKeyDown,
  };
}
