'use client';
import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  function execCmd(command: string, val?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleChange();
  }

  function handleChange() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  function insertLink() {
    const url = prompt('URL del enlace:');
    if (url) execCmd('createLink', url);
  }

  const btn = 'px-2 py-1 text-sm border border-gray-300 bg-white hover:bg-gray-100 rounded transition-colors';

  return (
    <div className="border border-gray-300 rounded overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
        <select
          className="text-sm border border-gray-300 bg-white rounded px-1 py-1"
          onChange={(e) => { execCmd('formatBlock', e.target.value); e.target.value = 'p'; }}
          defaultValue="p"
        >
          <option value="p">Párrafo</option>
          <option value="h2">Título 2</option>
          <option value="h3">Título 3</option>
          <option value="blockquote">Cita</option>
        </select>
        <button type="button" className={btn} onClick={() => execCmd('bold')}><strong>N</strong></button>
        <button type="button" className={btn} onClick={() => execCmd('italic')}><em>C</em></button>
        <button type="button" className={btn} onClick={() => execCmd('underline')}><u>S</u></button>
        <button type="button" className={btn} onClick={() => execCmd('strikeThrough')}><s>T</s></button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" className={btn} onClick={() => execCmd('insertUnorderedList')}>☰</button>
        <button type="button" className={btn} onClick={() => execCmd('insertOrderedList')}>1.</button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" className={btn} onClick={insertLink}>🔗 Enlace</button>
        <button type="button" className={btn} onClick={() => execCmd('unlink')}>✂️</button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" className={btn} onClick={() => execCmd('removeFormat')}>Limpiar</button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleChange}
        className="min-h-64 p-4 bg-white focus:outline-none text-base leading-relaxed"
        style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}
        data-placeholder="Escribe el contenido completo de la noticia aquí..."
      />

      <style>{`
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; }
        [contenteditable] blockquote { border-left: 4px solid #003F8A; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #4B5563; }
        [contenteditable] h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; color: #003F8A; }
        [contenteditable] h3 { font-size: 1.2rem; font-weight: 600; margin: 0.75rem 0 0.25rem; }
        [contenteditable] ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        [contenteditable] ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        [contenteditable] a { color: #003F8A; text-decoration: underline; }
        [contenteditable] p { margin-bottom: 0.75rem; }
      `}</style>
    </div>
  );
}
