import React, { useEffect, useRef } from 'react';
import { Block } from '../../types/editor';
import { useFormatApplier } from '../../hooks/useFormatApplier';

interface HeadingBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const HeadingBlock: React.FC<HeadingBlockProps> = ({
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

  const headingLevel = block.type === 'heading1' ? 'text-3xl font-bold' :
                       block.type === 'heading2' ? 'text-2xl font-semibold' :
                       'text-xl font-medium';

  return (
    <div 
      className="block-element py-1"
      data-block-id={block.id}
    >
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        className={`outline-none ${headingLevel}`}
        onInput={handleInput}
        onKeyDown={onKeyDown}
        data-placeholder={`Heading ${block.type.charAt(block.type.length - 1)}...`}
        dangerouslySetInnerHTML={{ __html: block.content || '' }}
      />
    </div>
  );
};

export default HeadingBlock;