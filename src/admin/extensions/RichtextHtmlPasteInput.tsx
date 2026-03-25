import React, { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/models/dom';
import 'tinymce/themes/silver';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';
import 'tinymce/skins/ui/oxide/skin.js';
import 'tinymce/skins/content/default/content.js';

// #region agent log H-I: module evaluated
console.info('[DEBUG-33de34][H-I] RichtextHtmlPasteInput module evaluated');
fetch('http://127.0.0.1:7705/ingest/603965e3-38e7-429a-b23a-4fd7a5669d82',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'33de34'},body:JSON.stringify({sessionId:'33de34',location:'RichtextHtmlPasteInput.tsx:module',message:'module evaluated',data:{},timestamp:Date.now(),hypothesisId:'H-I'})}).catch(()=>{});
// #endregion

import { normalizeEditorHtml } from './richtextHtmlUtils';

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

const VALID_ELEMENTS = [
  'a[href|target|rel|class|style|title]',
  'blockquote[class|style]',
  'br',
  'code[class]',
  'div[class|style]',
  'em/i',
  'figcaption[class|style]',
  'figure[class|style]',
  'font[face|size|color]',
  'h1[class|style]',
  'h2[class|style]',
  'h3[class|style]',
  'h4[class|style]',
  'h5[class|style]',
  'h6[class|style]',
  'hr[class|style]',
  'img[src|alt|title|width|height|style|class|loading]',
  'iframe[src|title|width|height|style|class|allow|allowfullscreen|frameborder]',
  'li[class|style]',
  'ol[class|style]',
  'p[class|style]',
  'pre[class|style]',
  's/strike',
  'span[class|style]',
  'strong/b',
  'sub',
  'sup',
  'table[style|class|width|height|border|cellspacing|cellpadding]',
  'tbody[class|style]',
  'td[colspan|rowspan|class|style|width|height]',
  'tfoot[class|style]',
  'th[colspan|rowspan|scope|class|style|width|height]',
  'thead[class|style]',
  'tr[class|style]',
  'u',
  'ul[class|style]',
].join(',');

const CONTENT_STYLE = `
  body {
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: #101828;
    padding: 12px;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  img.align-left,
  figure.align-left {
    float: left;
    margin: 0 1em 1em 0;
  }

  img.align-right,
  figure.align-right {
    float: right;
    margin: 0 0 1em 1em;
  }

  img.align-center,
  figure.align-center {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  figure.image {
    display: inline-block;
    border: 1px solid gray;
    margin: 0 2px 0 1px;
    background: #f5f2f0;
  }

  figure.image img {
    margin: 8px 8px 0 8px;
  }

  figure.image figcaption {
    margin: 6px 8px 6px 8px;
    text-align: center;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td,
  th {
    border: 1px solid #d0d5dd;
    padding: 8px 10px;
    vertical-align: top;
  }

  blockquote {
    border-left: 4px solid #98a2b3;
    margin: 1rem 0;
    padding-left: 1rem;
    color: #475467;
  }
`;

export function RichtextHtmlPasteInput({
  name,
  value,
  onChange,
  attribute,
  disabled = false,
  required = false,
  intlLabel,
  description,
  error,
  hint,
}: RichtextHtmlPasteInputProps) {
  // #region agent log H-C/H-E: component mounted
  React.useEffect(() => {
    fetch('http://127.0.0.1:7705/ingest/603965e3-38e7-429a-b23a-4fd7a5669d82',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'33de34'},body:JSON.stringify({sessionId:'33de34',location:'RichtextHtmlPasteInput.tsx:mount',message:'RichtextHtmlPasteInput component MOUNTED',data:{name,attributeType:attribute?.type,disabled},timestamp:Date.now(),hypothesisId:'H-C'})}).catch(()=>{});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endregion

  const editorId = useId();
  const helperText = hint || description?.defaultMessage || '';
  const htmlValue = typeof value === 'string' ? value : '';
  const editorValue = useMemo(() => htmlValue, [htmlValue]);
  const lastEmittedValueRef = useRef(editorValue);

  useEffect(() => {
    lastEmittedValueRef.current = editorValue;
  }, [editorValue]);

  const emitChange = useCallback(
    (newHtml: string) => {
      const normalizedHtml = normalizeEditorHtml(newHtml);
      if (normalizedHtml === lastEmittedValueRef.current) {
        return;
      }

      lastEmittedValueRef.current = normalizedHtml;
      onChange({
        target: { name, type: attribute.type, value: normalizedHtml },
      });
    },
    [attribute.type, name, onChange]
  );

  const handleEditorChange = useCallback(
    (newHtml: string) => {
      emitChange(newHtml);
    },
    [emitChange]
  );

  const editorConfig = useMemo(
    () => ({
      license_key: 'gpl',
      promotion: false,
      branding: false,
      content_css: false,
      menubar: 'edit view insert format table tools',
      min_height: 420,
      resize: true,
      toolbar_mode: 'sliding' as const,
      plugins: [
        'advlist',
        'autolink',
        'autoresize',
        'charmap',
        'code',
        'codesample',
        'image',
        'link',
        'lists',
        'preview',
        'quickbars',
        'table',
        'visualblocks',
        'wordcount',
      ],
      toolbar:
        'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table blockquote | codesample code removeformat visualblocks preview',
      block_formats:
        'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Blockquote=blockquote; Preformatted=pre',
      formats: {
        alignleft: [
          { selector: 'img', classes: 'align-left' },
          { selector: 'figure', classes: 'align-left' },
          { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,pre', styles: { textAlign: 'left' } },
        ],
        aligncenter: [
          { selector: 'img', classes: 'align-center' },
          { selector: 'figure', classes: 'align-center' },
          { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,pre', styles: { textAlign: 'center' } },
        ],
        alignright: [
          { selector: 'img', classes: 'align-right' },
          { selector: 'figure', classes: 'align-right' },
          { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,pre', styles: { textAlign: 'right' } },
        ],
        alignjustify: [
          { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,pre', styles: { textAlign: 'justify' } },
        ],
      },
      quickbars_insert_toolbar: false,
      quickbars_selection_toolbar: 'bold italic underline | blocks | alignleft aligncenter alignright',
      quickbars_image_toolbar: 'alignleft aligncenter alignright | imageoptions',
      font_family_formats:
        'Arial=Arial,Helvetica,sans-serif; Georgia=Georgia,serif; Inter=Inter,sans-serif; Tahoma=Tahoma,Arial,sans-serif; Times New Roman="Times New Roman",Times,serif; Verdana=Verdana,Geneva,sans-serif',
      font_size_formats: '10px 12px 14px 16px 18px 20px 24px 30px 36px 48px',
      valid_elements: VALID_ELEMENTS,
      invalid_elements: 'script',
      paste_as_text: false,
      paste_data_images: true,
      paste_webkit_styles: 'all',
      paste_merge_formats: true,
      image_title: true,
      image_caption: true,
      image_advtab: true,
      image_class_list: [
        { title: 'None', value: '' },
        { title: 'Align left', value: 'align-left' },
        { title: 'Align right', value: 'align-right' },
        { title: 'Center', value: 'align-center' },
      ],
      object_resizing: 'img,table',
      table_default_attributes: { border: '1' },
      table_default_styles: { width: '100%', borderCollapse: 'collapse' },
      table_toolbar:
        'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
      content_style: CONTENT_STYLE,
      setup: (editor: any) => {
        editor.on('PastePreProcess', (event: any) => {
          if (typeof event.content === 'string') {
            event.content = normalizeEditorHtml(event.content);
          }
        });
      },
    }),
    []
  );

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <label htmlFor={editorId} style={{ fontSize: 14, fontWeight: 600, color: '#344054' }}>
        {intlLabel?.defaultMessage || 'Rich text'}
        {required ? ' *' : ''}
      </label>

      <div
        style={{
          border: error ? '1px solid #f04438' : '1px solid #d0d5dd',
          borderRadius: 8,
          overflow: 'hidden',
          background: disabled ? '#f8fafc' : '#ffffff',
        }}
      >
        <Editor
          id={editorId}
          textareaName={name}
          disabled={disabled}
          rollback={false}
          value={editorValue}
          onEditorChange={handleEditorChange}
          init={editorConfig}
        />
      </div>

      {helperText ? (
        <p style={{ margin: 0, fontSize: 12, color: '#667085' }}>
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p style={{ margin: 0, fontSize: 12, color: '#f04438' }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

RichtextHtmlPasteInput.displayName = 'RichtextHtmlPasteInput';

export default RichtextHtmlPasteInput;

