/**
 * Custom richtext Input that preserves HTML when pasting from Google Docs (or any source).
 * On paste, uses clipboard text/html when available so formatting is kept.
 * Inline font-family and background-color styles are stripped so the frontend CSS
 * controls typography, but font-size and color from the source document are preserved.
 * Stores and emits HTML string; backend uses type "text" so HTML is persisted as-is.
 */

import React, { useRef, useEffect, useCallback } from 'react';

interface RichtextHtmlPasteInputProps {
  name: string;
  value: string | null | undefined;
  onChange: (payload: { target: { name: string; type: string; value: string } }) => void;
  attribute: { type: string };
  disabled?: boolean;
  required?: boolean;
  placeholder?: { id?: string; defaultMessage?: string };
  intlLabel?: { id?: string; defaultMessage?: string };
  description?: { id?: string; defaultMessage?: string };
  error?: string;
  hint?: string;
}

/**
 * Walk every element in a DocumentFragment (or Element) and remove inline style
 * properties that would override the frontend's typography system.
 * Code/pre blocks are left untouched.
 */
function stripTypographyStyles(root: DocumentFragment | Element): void {
  const BLOCKED_PROPS = [
    'fontFamily',
    'backgroundColor',
    'lineHeight',
  ];

  // Properties we intentionally keep: fontWeight, fontStyle (italic), textDecoration (underline/strike)
  const KEEP_PROPS = new Set(['fontStyle', 'textDecoration', 'fontWeight']);

  const walker = document.createTreeWalker(root as Node, NodeFilter.SHOW_ELEMENT);
  const elements: Element[] = [];
  let node: Node | null = walker.currentNode;
  while (node) {
    elements.push(node as Element);
    node = walker.nextNode();
  }

  for (const el of elements) {
    const tag = (el as HTMLElement).tagName?.toLowerCase();
    // Leave code/pre untouched
    if (tag === 'code' || tag === 'pre') continue;

    const htmlEl = el as HTMLElement;
    if (!htmlEl.style) continue;

    // Remove only the typography-related inline props, keep others (e.g. text-align)
    BLOCKED_PROPS.forEach((prop) => {
      if (!KEEP_PROPS.has(prop)) {
        htmlEl.style.removeProperty(
          prop.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
        );
      }
    });

    // Also remove Google Docs span wrappers that carry only empty/whitespace styles
    if (tag === 'span' && htmlEl.getAttribute('style')?.trim() === '') {
      htmlEl.removeAttribute('style');
    }
  }
}

export function RichtextHtmlPasteInput({
  name,
  value,
  onChange,
  attribute,
  disabled = false,
  required = false,
}: RichtextHtmlPasteInputProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef<string>(typeof value === 'string' ? value : '');
  const isInternalChangeRef = useRef(false);

  const htmlValue = typeof value === 'string' ? value : '';

  // Sync when value is set externally (e.g. initial load or switching entry), not when we just emitted
  useEffect(() => {
    const el = editorRef.current;
    if (!el || isInternalChangeRef.current) return;
    const valueChanged = htmlValue !== lastValueRef.current;
    const needsInitialFill = el.innerHTML === '' && htmlValue;
    if (valueChanged || needsInitialFill) {
      el.innerHTML = htmlValue || '';
      lastValueRef.current = htmlValue || '';
    }
  }, [htmlValue]);

  const emitChange = useCallback(
    (newHtml: string) => {
      lastValueRef.current = newHtml;
      isInternalChangeRef.current = true;
      onChange({
        target: { name, type: attribute.type, value: newHtml },
      });
      // Allow next useEffect to run for external value changes
      requestAnimationFrame(() => {
        isInternalChangeRef.current = false;
      });
    },
    [name, attribute.type, onChange]
  );

  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    if (html !== lastValueRef.current) {
      emitChange(html);
    }
  }, [emitChange]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const el = editorRef.current;
      if (!el) return;
      const html = e.clipboardData?.getData('text/html');
      const text = e.clipboardData?.getData('text/plain') ?? '';
      const sel = window.getSelection();
      const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
      const rangeInEditor = range && el.contains(range.commonAncestorContainer);

      if (html) {
        // Parse into a fragment, strip inline typography styles, then insert
        const fragment = el.ownerDocument.createRange().createContextualFragment(html);
        stripTypographyStyles(fragment);

        if (rangeInEditor) {
          range.deleteContents();
          range.insertNode(fragment);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        } else {
          el.innerHTML = '';
          el.appendChild(fragment);
        }
      } else if (text) {
        const textNode = el.ownerDocument.createTextNode(text);
        if (rangeInEditor) {
          range.deleteContents();
          range.insertNode(textNode);
          range.setStartAfter(textNode);
          range.collapse(true);
          sel?.removeAllRanges();
          sel?.addRange(range);
        } else {
          el.innerHTML = '';
          el.appendChild(textNode);
        }
      }
      emitChange(el.innerHTML);
    },
    [emitChange]
  );

  return (
    <div
      ref={editorRef}
      contentEditable={!disabled}
      suppressContentEditableWarning
      onInput={handleInput}
      onPaste={handlePaste}
      data-placeholder="Write or paste content here (HTML from Google Docs is preserved)..."
      style={{
        minHeight: 200,
        padding: '12px 16px',
        border: '1px solid #e2e8f0',
        borderRadius: 4,
        outline: 'none',
        fontSize: 14,
        lineHeight: 1.6,
      }}
    />
  );
}

// Prevent React from overwriting innerHTML after first set; we control it via ref and effects
RichtextHtmlPasteInput.displayName = 'RichtextHtmlPasteInput';

export default RichtextHtmlPasteInput;

