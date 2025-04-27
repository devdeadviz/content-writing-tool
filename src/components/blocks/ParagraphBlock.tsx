import React, { useEffect, useRef } from 'react';
import { Block } from '../../types/editor';
import { useFormatApplier } from '../../hooks/useFormatApplier';

interface ParagraphBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const ParagraphBlock: React.FC<ParagraphBlockProps> = ({ 
  block, 
  onContentChange,
  onKeyDown 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const applyFormat = useFormatApplier(contentRef, block.format);
  
  // Apply formatting whenever block content or format changes
  useEffect(() => {
    if (contentRef.current) {
      applyFormat();
    }
  }, [block.content, block.format, applyFormat]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    onContentChange(content);
  };

  return (
    <div 
      className="block-element py-1"
      data-block-id={block.id}
    >
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        className="outline-none"
        onInput={handleInput}
        onKeyDown={onKeyDown}
        data-placeholder="Type something..."
        dangerouslySetInnerHTML={{ __html: block.content || '' }}
      />
    </div>
  );
};

export default ParagraphBlock;