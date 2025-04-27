import React from 'react';
import { Block } from '../types/editor';
import { useEditor } from '../context/EditorContext';
import ParagraphBlock from './blocks/ParagraphBlock';
import HeadingBlock from './blocks/HeadingBlock';
import ListBlock from './blocks/ListBlock';
import CodeBlock from './blocks/CodeBlock';
import QuoteBlock from './blocks/QuoteBlock';
import CalloutBlock from './blocks/CalloutBlock';

interface BlockRendererProps {
  block: Block;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onKeyDown }) => {
  const { updateBlock } = useEditor();
  
  const handleContentChange = (content: string) => {
    updateBlock(block.id, { content });
  };

  // Render different block types
  switch (block.type) {
    case 'paragraph':
      return (
        <ParagraphBlock
          block={block}
          onContentChange={handleContentChange}
          onKeyDown={onKeyDown}
        />
      );
      
    case 'heading1':
    case 'heading2':
    case 'heading3':
      return (
        <HeadingBlock
          block={block}
          onContentChange={handleContentChange}
          onKeyDown={onKeyDown}
        />
      );
      
    case 'bulletList':
    case 'numberedList':
      return (
        <ListBlock
          block={block}
          onContentChange={handleContentChange}
          onKeyDown={onKeyDown}
        />
      );
      
    case 'codeBlock':
      return (
        <CodeBlock
          block={block}
          onContentChange={handleContentChange}
          onKeyDown={onKeyDown}
        />
      );
      
    case 'quote':
      return (
        <QuoteBlock
          block={block}
          onContentChange={handleContentChange}
          onKeyDown={onKeyDown}
        />
      );
      
    case 'callout':
      return (
        <CalloutBlock
          block={block}
          onContentChange={handleContentChange}
          onKeyDown={onKeyDown}
        />
      );
      
    default:
      return (
        <div>
          Unsupported block type: {block.type}
        </div>
      );
  }
};

export default BlockRenderer;