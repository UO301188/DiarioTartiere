'use client';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Estilos del editor

// Cargamos el editor de forma dinámica para evitar errores de SSR
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded border border-gray-300 flex items-center justify-center">Cargando editor...</div>
});

export default function RichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean'] // Botón para quitar formatos
        ],
    };

    return (
        <div className="mb-12">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                className="bg-white h-64 md:h-96"
            />
        </div>
    );
}