// Types of blocks supported by the editor
export type BlockType = 
  | 'paragraph' 
  | 'heading1' 
  | 'heading2' 
  | 'heading3' 
  | 'bulletList' 
  | 'numberedList' 
  | 'codeBlock' 
  | 'quote'
  | 'callout';

// Types of inline elements that can be inserted
export type InlineElementType = 
  | 'link' 
  | 'mention' 
  | 'variable' 
  | 'command';

// Types of text formatting
export type FormatType = 
  | 'bold' 
  | 'italic' 
  | 'underline' 
  | 'code' 
  | 'color' 
  | 'highlight';

// Types of callouts
export type CalloutType = 'info' | 'warning' | 'error';

// Block model
export interface Block {
  id: string;
  type: BlockType;
  content: string;
  format: Record<FormatType, boolean | string>;
  metadata?: Record<string, any>;
  indent?: number;
  calloutType?: CalloutType;
}

// Inline element model
export interface InlineElement {
  id: string;
  type: InlineElementType;
  blockId: string;
  startOffset: number;
  endOffset: number;
  data: Record<string, any>;
}

// Selection range model
export interface SelectionRange {
  blockId: string;
  startOffset: number;
  endOffset: number;
}

// Editor state model
export interface EditorState {
  blocks: Block[];
  inlineElements: InlineElement[];
  selection: SelectionRange | null;
}

// Context type for the editor
export interface EditorContextType {
  state: EditorState;
  updateSelection: (selection: SelectionRange | null) => void;
  getBlockById: (id: string) => Block | undefined;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  insertBlock: (blockData: Omit<Block, 'id'>, afterId?: string) => string;
  deleteBlock: (id: string) => void;
  formatText: (blockId: string, formatType: FormatType, value: boolean | string) => void;
  addInlineElement: (element: Omit<InlineElement, 'id'>) => string;
  updateInlineElement: (id: string, updates: Partial<InlineElement>) => void;
  removeInlineElement: (id: string) => void;
}

// Keyboard shortcut definition
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: () => void;
}

// Command definition for slash commands
export interface SlashCommand {
  name: string;
  description: string;
  icon?: React.ReactNode;
  action: () => void;
}