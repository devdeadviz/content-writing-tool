import React, { useEffect, useRef } from 'react';
import { Block } from '../../types/editor';
import { useFormatApplier } from '../../hooks/useFormatApplier';

interface ListBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const ListBlock: React.FC<ListBlockProps> = ({
  block,
  onContentChange,
  onKeyDown
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const applyFormat = useFormatApplier(contentRef, block.format);

  useEffect(() => {
    if (contentRef.current) {
      applyFormat();
    }
  }, [block.content, block.format, applyFormat]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    onContentChange(content);
  };

  const listType = block.type === 'bulletList' ? 'bullet' : 'numbered';
  const indentStyle = {
    marginLeft: `${(block.indent || 0) * 1.5}rem`
  };

  return (
    <div 
      className={`block-element list-item ${listType}`}
      data-block-id={block.id}
      style={indentStyle}
    >
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        className="outline-none"
        onInput={handleInput}
        onKeyDown={onKeyDown}
        data-placeholder="List item..."
        dangerouslySetInnerHTML={{ __html: block.content || '' }}
      />
    </div>
  );
};

export default ListBlock;