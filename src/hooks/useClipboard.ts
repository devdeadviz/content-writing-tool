import { useEffect, RefObject } from 'react';
import { useEditor } from '../context/EditorContext';

export const useClipboard = (editorRef: RefObject<HTMLElement>) => {
  const { state, updateBlock } = useEditor();
  
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!editorRef.current) return;
      
      // Ignore paste events when not focused on the editor
      if (!editorRef.current.contains(document.activeElement)) return;
      
      // Get selection to determine where to paste
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const blockEl = range.startContainer.nodeType === 1 
        ? range.startContainer as HTMLElement
        : range.startContainer.parentElement;
        
      const blockId = blockEl?.closest('[data-block-id]')?.getAttribute('data-block-id');
      if (!blockId) return;
      
      const block = state.blocks.find(b => b.id === blockId);
      if (!block) return;
      
      // Get clipboard plain text content
      const clipboardText = e.clipboardData?.getData('text/plain');
      if (!clipboardText) return;
      
      // Cancel default paste behavior
      e.preventDefault();
      
      // Insert text at cursor position
      const startOffset = range.startOffset;
      const endOffset = range.endOffset;
      
      const currentContent = block.content || '';
      const newContent = 
        currentContent.substring(0, startOffset) + 
        clipboardText + 
        currentContent.substring(endOffset);
      
      updateBlock(blockId, { content: newContent });
      
      // Move cursor to end of pasted text
      const newPosition = startOffset + clipboardText.length;
      
      // Wait for the DOM to update before setting the selection
      setTimeout(() => {
        const blockElement = document.querySelector(`[data-block-id="${blockId}"] [contenteditable]`);
        if (!blockElement || !blockElement.firstChild) return;
        
        const textNode = blockElement.firstChild;
        const newRange = document.createRange();
        newRange.setStart(textNode, newPosition);
        newRange.setEnd(textNode, newPosition);
        
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      }, 0);
    };
    
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [editorRef, state.blocks, updateBlock]);
};