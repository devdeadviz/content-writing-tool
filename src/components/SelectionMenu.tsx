import React from 'react';
import { Bold, Italic, Underline, Link, Code } from 'lucide-react';
import { SelectionRange, FormatType } from '../types/editor';
import { useEditor } from '../context/EditorContext';

interface SelectionMenuProps {
  position: {
    top: number;
    left: number;
  };
  selection: SelectionRange;
}

const SelectionMenu: React.FC<SelectionMenuProps> = ({ position, selection }) => {
  const { formatText, addInlineElement } = useEditor();
  
  const toggleFormat = (formatType: FormatType) => {
    formatText(selection.blockId, formatType, true);
  };
  
  const createLink = () => {
    addInlineElement({
      type: 'link',
      blockId: selection.blockId,
      startOffset: selection.startOffset,
      endOffset: selection.endOffset,
      data: {
        url: 'https://example.com',
        text: 'Link'
      }
    });
  };

  return (
    <div 
      className="selection-menu absolute bg-white border border-slate-200 rounded-md shadow-lg p-1 flex items-center z-20"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <button 
        className="format-button"
        onClick={() => toggleFormat('bold')}
        aria-label="Bold"
      >
        <Bold size={16} />
      </button>
      
      <button 
        className="format-button"
        onClick={() => toggleFormat('italic')}
        aria-label="Italic"
      >
        <Italic size={16} />
      </button>
      
      <button 
        className="format-button"
        onClick={() => toggleFormat('underline')}
        aria-label="Underline"
      >
        <Underline size={16} />
      </button>
      
      <button 
        className="format-button"
        onClick={() => toggleFormat('code')}
        aria-label="Inline Code"
      >
        <Code size={16} />
      </button>
      
      <button 
        className="format-button"
        onClick={createLink}
        aria-label="Create Link"
      >
        <Link size={16} />
      </button>
    </div>
  );
};

export default SelectionMenu;