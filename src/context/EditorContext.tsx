import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  EditorState,
  EditorContextType,
  Block,
  InlineElement,
  SelectionRange,
  FormatType,
} from "../types/editor";

const defaultState: EditorState = {
  blocks: [
    {
      id: "1",
      type: "paragraph",
      content: "Start writing your content here...",
      format: {},
    },
  ],
  inlineElements: [],
  selection: null,
};

// Create the context
const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<EditorState>(() => {
    // Load from localStorage if available
    const savedState = localStorage.getItem("editor-state");
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error("Failed to parse saved editor state:", e);
      }
    }
    return defaultState;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("editor-state", JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save editor state:", e);
    }
  }, [state]);

  const updateSelection = useCallback((selection: SelectionRange | null) => {
    setState((prev) => ({
      ...prev,
      selection,
    }));
  }, []);

  const getBlockById = useCallback(
    (id: string): Block | undefined => {
      return state.blocks.find((block) => block.id === id);
    },
    [state.blocks]
  );

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setState((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      ),
    }));
  }, []);

  const insertBlock = useCallback(
    (blockData: Omit<Block, "id">, afterId?: string) => {
      const newBlock: Block = {
        ...blockData,
        id: Math.random().toString(36).substr(2, 9),
      };

      setState((prev) => {
        const afterIndex = afterId
          ? prev.blocks.findIndex((b) => b.id === afterId)
          : prev.blocks.length - 1;

        if (afterIndex === -1) {
          return {
            ...prev,
            blocks: [...prev.blocks, newBlock],
          };
        }

        const newBlocks = [...prev.blocks];
        newBlocks.splice(afterIndex + 1, 0, newBlock);

        return {
          ...prev,
          blocks: newBlocks,
        };
      });

      return newBlock.id;
    },
    []
  );

  const deleteBlock = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== id),
    }));
  }, []);

  const formatText = useCallback(
    (blockId: string, formatType: FormatType, value: boolean | string) => {
      setState((prev) => {
        const block = prev.blocks.find((b) => b.id === blockId);
        if (!block) return prev;

        return {
          ...prev,
          blocks: prev.blocks.map((b) => {
            if (b.id !== blockId) return b;

            return {
              ...b,
              format: {
                ...b.format,
                [formatType]: value,
              },
            };
          }),
        };
      });
    },
    []
  );

  const addInlineElement = useCallback((element: Omit<InlineElement, "id">) => {
    const newElement: InlineElement = {
      ...element,
      id: Math.random().toString(36).substr(2, 9),
    };

    setState((prev) => ({
      ...prev,
      inlineElements: [...prev.inlineElements, newElement],
    }));

    return newElement.id;
  }, []);

  const updateInlineElement = useCallback(
    (id: string, updates: Partial<InlineElement>) => {
      setState((prev) => ({
        ...prev,
        inlineElements: prev.inlineElements.map((element) =>
          element.id === id ? { ...element, ...updates } : element
        ),
      }));
    },
    []
  );

  const removeInlineElement = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      inlineElements: prev.inlineElements.filter(
        (element) => element.id !== id
      ),
    }));
  }, []);

  const value = {
    state,
    updateSelection,
    getBlockById,
    updateBlock,
    insertBlock,
    deleteBlock,
    formatText,
    addInlineElement,
    updateInlineElement,
    removeInlineElement,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
