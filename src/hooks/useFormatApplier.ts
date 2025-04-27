import { useCallback } from 'react';
import { FormatType } from '../types/editor';

type FormatObject = Record<FormatType, boolean | string>;

export const useFormatApplier = (
  elementRef: React.RefObject<HTMLElement>,
  format: FormatObject
) => {
  const applyFormat = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    
    // Save selection to restore it later
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    
    // Get the original content
    const content = el.innerHTML;
    
    // Create a temporary div to process the formatting
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Apply bold formatting
    if (format.bold) {
      // This is a simplistic approach - in a real editor you'd need more sophisticated formatting
      tempDiv.innerHTML = `<strong>${tempDiv.innerHTML}</strong>`;
    }
    
    // Apply italic formatting
    if (format.italic) {
      tempDiv.innerHTML = `<em>${tempDiv.innerHTML}</em>`;
    }
    
    // Apply underline formatting
    if (format.underline) {
      tempDiv.innerHTML = `<u>${tempDiv.innerHTML}</u>`;
    }
    
    // Apply inline code formatting
    if (format.code) {
      tempDiv.innerHTML = `<code class="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-sm">${tempDiv.innerHTML}</code>`;
    }
    
    // Apply color formatting
    if (format.color && typeof format.color === 'string') {
      tempDiv.innerHTML = `<span style="color: ${format.color}">${tempDiv.innerHTML}</span>`;
    }
    
    // Apply highlight formatting
    if (format.highlight && typeof format.highlight === 'string') {
      tempDiv.innerHTML = `<span style="background-color: ${format.highlight}">${tempDiv.innerHTML}</span>`;
    }
    
    // Update the actual content
    el.innerHTML = tempDiv.innerHTML;
    
    // Restore selection if possible
    if (range && selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [elementRef, format]);
  
  return applyFormat;
};