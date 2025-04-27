import React, { useEffect, useRef } from 'react';
import { Block } from '../../types/editor';

interface CodeBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  block,
  onContentChange,
  onKeyDown
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    onContentChange(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // For code blocks, we want to insert a tab character when Tab is pressed
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const tabChar = '\t';
      
      const tabNode = document.createTextNode(tabChar);
      range.insertNode(tabNode);
      
      // Move cursor after the inserted tab
      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Update the content with the new tab
      if (contentRef.current) {
        const newContent = contentRef.current.textContent || '';
        onContentChange(newContent);
      }
      
      return;
    }
    
    // Call the original onKeyDown handler for other keys
    onKeyDown(e);
  };

  return (
    <div 
      className="block-element code-block"
      data-block-id={block.id}
    >
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        className="outline-none font-mono whitespace-pre-wrap break-all"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder="Code..."
        dangerouslySetInnerHTML={{ __html: block.content || '' }}
      />
    </div>
  );
};

export default CodeBlock;