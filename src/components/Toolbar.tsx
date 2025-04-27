import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Terminal,
  AlertCircle 
} from 'lucide-react';
import { Block, BlockType, FormatType } from '../types/editor';

const Toolbar: React.FC = () => {
  const { state, formatText, updateBlock, insertBlock } = useEditor();
  const { selection, blocks } = state;
  
  const [showBlockOptions, setShowBlockOptions] = useState(false);

  const toggleFormat = (formatType: FormatType) => {
    if (!selection) return;
    
    const block = blocks.find(b => b.id === selection.blockId);
    if (!block) return;
    
    const currentValue = !!block.format[formatType];
    formatText(selection.blockId, formatType, !currentValue);
  };
  
  const changeBlockType = (newType: BlockType) => {
    if (!selection) return;
    
    const block = blocks.find(b => b.id === selection.blockId);
    if (!block) return;
    
    updateBlock(selection.blockId, { type: newType });
    setShowBlockOptions(false);
  };
  
  const insertBlockElement = (blockType: BlockType) => {
    const blockData: Omit<Block, 'id'> = {
      type: blockType,
      content: '',
      format: {}
    };
    
    if (blockType === 'callout') {
      blockData.calloutType = 'info';
    }
    
    const currentBlockId = selection?.blockId;
    insertBlock(blockData, currentBlockId);
    setShowBlockOptions(false);
  };
  
  const isFormatActive = (formatType: FormatType): boolean => {
    if (!selection) return false;
    
    const block = blocks.find(b => b.id === selection.blockId);
    return block ? !!block.format[formatType] : false;
  };
  
  const getBlockTypeLabel = (): string => {
    if (!selection) return 'Paragraph';
    
    const block = blocks.find(b => b.id === selection.blockId);
    if (!block) return 'Paragraph';
    
    switch (block.type) {
      case 'paragraph': return 'Paragraph';
      case 'heading1': return 'Heading 1';
      case 'heading2': return 'Heading 2';
      case 'heading3': return 'Heading 3';
      case 'bulletList': return 'Bullet List';
      case 'numberedList': return 'Numbered List';
      case 'codeBlock': return 'Code Block';
      case 'quote': return 'Quote';
      case 'callout': return 'Callout';
      default: return 'Paragraph';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-1 flex items-center space-x-1">
      <div className="relative">
        <button
          className="px-3 py-1.5 text-sm rounded-md hover:bg-slate-100 transition-colors flex items-center"
          onClick={() => setShowBlockOptions(!showBlockOptions)}
        >
          {getBlockTypeLabel()}
          <span className="ml-2">&darr;</span>
        </button>
        
        {showBlockOptions && (
          <div className="absolute top-full left-0 mt-1 z-10 bg-white border border-slate-200 rounded-md shadow-lg p-1 min-w-48 toolbar-popup">
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md flex items-center"
              onClick={() => changeBlockType('paragraph')}
            >
              <span className="mr-2 w-5 h-5 flex items-center justify-center">P</span>
              Paragraph
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md flex items-center"
              onClick={() => changeBlockType('heading1')}
            >
              <Heading1 className="mr-2" size={16} />
              Heading 1
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md flex items-center"
              onClick={() => changeBlockType('heading2')}
            >
              <Heading2 className="mr-2" size={16} />
              Heading 2
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md flex items-center"
              onClick={() => changeBlockType('bulletList')}
            >
              <List className="mr-2" size={16} />
              Bullet List
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md flex items-center"
              onClick={() => changeBlockType('numberedList')}
            >
              <ListOrdered className="mr-2" size={16} />
              Numbered List
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md flex items-center"
              onClick={() => changeBlockType('codeBlock')}
            >
              <Terminal className="mr-2" size={16} />
              Code Block
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md flex items-center"
              onClick={() => changeBlockType('quote')}
            >
              <Quote className="mr-2" size={16} />
              Quote
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md flex items-center"
              onClick={() => changeBlockType('callout')}
            >
              <AlertCircle className="mr-2" size={16} />
              Callout
            </button>
          </div>
        )}
      </div>
      
      <div className="h-5 w-px bg-slate-200 mx-1"></div>
      
      <button 
        className={`format-button ${isFormatActive('bold') ? 'active' : ''}`}
        onClick={() => toggleFormat('bold')}
        aria-label="Bold"
      >
        <Bold size={18} />
      </button>
      
      <button 
        className={`format-button ${isFormatActive('italic') ? 'active' : ''}`}
        onClick={() => toggleFormat('italic')}
        aria-label="Italic"
      >
        <Italic size={18} />
      </button>
      
      <button 
        className={`format-button ${isFormatActive('underline') ? 'active' : ''}`}
        onClick={() => toggleFormat('underline')}
        aria-label="Underline"
      >
        <Underline size={18} />
      </button>
      
      <button 
        className={`format-button ${isFormatActive('code') ? 'active' : ''}`}
        onClick={() => toggleFormat('code')}
        aria-label="Inline Code"
      >
        <Code size={18} />
      </button>
    </div>
  );
};

export default Toolbar;