import React, { useEffect, useRef, useState } from 'react';
import { useEditor } from '../context/EditorContext';
import Toolbar from './Toolbar';
import BlockRenderer from './BlockRenderer';
import SelectionMenu from './SelectionMenu';
import { SelectionRange } from '../types/editor';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useClipboard } from '../hooks/useClipboard';

const Editor: React.FC = () => {
  const { 
    state, 
    updateSelection, 
    insertBlock, 
    updateBlock 
  } = useEditor();
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectionPosition, setSelectionPosition] = useState<{ top: number, left: number } | null>(null);
  
  // Set up keyboard shortcuts
  useKeyboardShortcuts(editorRef);
  
  // Set up clipboard handling
  useClipboard(editorRef);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      if (!selection || selection.rangeCount === 0 || !editorRef.current) {
        updateSelection(null);
        setSelectionPosition(null);
        return;
      }
      
      const range = selection.getRangeAt(0);
      const editorEl = editorRef.current;
      
      // Check if selection is within editor
      if (!editorEl.contains(range.commonAncestorContainer)) {
        updateSelection(null);
        setSelectionPosition(null);
        return;
      }
      
      // Find which block the selection is in
      const blockEl = range.commonAncestorContainer.nodeType === 1 
        ? range.commonAncestorContainer as HTMLElement
        : range.commonAncestorContainer.parentElement;
        
      const blockId = blockEl?.closest('[data-block-id]')?.getAttribute('data-block-id');
      
      if (blockId) {
        const newSelection: SelectionRange = {
          blockId,
          startOffset: range.startOffset,
          endOffset: range.endOffset
        };
        
        updateSelection(newSelection);
        
        // If there is an actual selection (not just cursor), show the selection menu
        if (range.startOffset !== range.endOffset) {
          const rect = range.getBoundingClientRect();
          setSelectionPosition({
            top: rect.top - 40,
            left: rect.left + (rect.width / 2)
          });
        } else {
          setSelectionPosition(null);
        }
      } else {
        updateSelection(null);
        setSelectionPosition(null);
      }
    };
    
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [updateSelection]);

  const handleBlockKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    const block = state.blocks.find(b => b.id === blockId);
    if (!block) return;
    
    // Handle Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      // Insert a new block of the same type as the current block
      insertBlock({
        type: block.type,
        content: '',
        format: {},
        indent: block.indent,
        calloutType: block.calloutType
      }, blockId);
    }
    
    // Handle Backspace on empty block
    if (e.key === 'Backspace' && block.content.trim() === '') {
      e.preventDefault();
      
      // Don't delete the last block, just clear it
      if (state.blocks.length === 1) {
        updateBlock(blockId, { 
          type: 'paragraph', 
          content: '', 
          format: {},
          indent: 0 
        });
        return;
      }
      
      // TODO: Focus previous block
    }
    
    // Handle Tab key for indentation in lists
    if (e.key === 'Tab') {
      e.preventDefault();
      
      if (block.type === 'bulletList' || block.type === 'numberedList') {
        const newIndent = e.shiftKey 
          ? Math.max(0, (block.indent || 0) - 1)
          : (block.indent || 0) + 1;
          
        updateBlock(blockId, { indent: newIndent });
      }
    }
    
    // Handle slash commands
    if (e.key === '/') {
      // TODO: Show command menu
    }
  };

  return (
    <div className="editor-wrapper bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <Toolbar />
      
      <div 
        ref={editorRef}
        className="editor-content mt-4 focus:outline-none"
        tabIndex={0}
      >
        {state.blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            onKeyDown={(e) => handleBlockKeyDown(e, block.id)}
          />
        ))}
      </div>
      
      {selectionPosition && state.selection && (
        <SelectionMenu
          position={selectionPosition}
          selection={state.selection}
        />
      )}
    </div>
  );
};

export default Editor;