import React, { useEffect, useRef } from 'react';
import { Block, CalloutType } from '../../types/editor';
import { useFormatApplier } from '../../hooks/useFormatApplier';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

interface CalloutBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const CalloutBlock: React.FC<CalloutBlockProps> = ({
  block,
  onContentChange,
  onKeyDown
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const applyFormat = useFormatApplier(contentRef, block.format);
  const { updateBlock } = useEditor();

  const calloutType = block.calloutType || 'info';

  useEffect(() => {
    if (contentRef.current) {
      applyFormat();
    }
  }, [block.content, block.format, applyFormat]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    onContentChange(content);
  };

  const changeCalloutType = (type: CalloutType) => {
    updateBlock(block.id, { calloutType: type });
  };

  const getCalloutIcon = () => {
    switch (calloutType) {
      case 'info':
        return <Info className="text-blue-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <div 
      className={`block-element callout-block callout-${calloutType}`}
      data-block-id={block.id}
    >
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">
          {getCalloutIcon()}
        </div>
        <div className="flex-1">
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className="outline-none"
            onInput={handleInput}
            onKeyDown={onKeyDown}
            data-placeholder="Callout content..."
            dangerouslySetInnerHTML={{ __html: block.content || '' }}
          />
        </div>
        <div className="ml-2 flex space-x-1">
          <button
            className={`p-1 rounded hover:bg-blue-200 ${calloutType === 'info' ? 'bg-blue-100' : ''}`}
            onClick={() => changeCalloutType('info')}
            title="Info"
          >
            <Info size={14} />
          </button>
          <button
            className={`p-1 rounded hover:bg-amber-200 ${calloutType === 'warning' ? 'bg-amber-100' : ''}`}
            onClick={() => changeCalloutType('warning')}
            title="Warning"
          >
            <AlertTriangle size={14} />
          </button>
          <button
            className={`p-1 rounded hover:bg-red-200 ${calloutType === 'error' ? 'bg-red-100' : ''}`}
            onClick={() => changeCalloutType('error')}
            title="Error"
          >
            <AlertCircle size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalloutBlock;