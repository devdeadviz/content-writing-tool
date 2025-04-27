import { useEffect, RefObject } from 'react';
import { useEditor } from '../context/EditorContext';
import { FormatType } from '../types/editor';

export const useKeyboardShortcuts = (editorRef: RefObject<HTMLElement>) => {
  const { state, formatText } = useEditor();
  const { selection } = state;
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selection || !editorRef.current) return;
      
      // Ignore key events when not focused on the editor
      if (!editorRef.current.contains(document.activeElement)) return;
      
      // Control (or Command) key shortcuts
      if ((e.ctrlKey || e.metaKey)) {
        let formatType: FormatType | null = null;
        
        // Bold: Ctrl+B
        if (e.key === 'b') {
          formatType = 'bold';
        }
        // Italic: Ctrl+I
        else if (e.key === 'i') {
          formatType = 'italic';
        }
        // Underline: Ctrl+U
        else if (e.key === 'u') {
          formatType = 'underline';
        }
        // Code: Ctrl+E (custom shortcut)
        else if (e.key === 'e') {
          formatType = 'code';
        }
        
        if (formatType) {
          e.preventDefault();
          const block = state.blocks.find(b => b.id === selection.blockId);
          
          if (block) {
            formatText(
              selection.blockId, 
              formatType, 
              !block.format[formatType]
            );
          }
        }
      }
      
      // More keyboard shortcuts can be added here
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editorRef, selection, state.blocks, formatText]);
};