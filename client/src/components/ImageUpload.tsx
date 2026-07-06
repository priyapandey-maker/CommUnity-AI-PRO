import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';

interface ImageUploadProps {
  onFileChange: (file: File | null) => void;
  hasError?: boolean;
}

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] };

export default function ImageUpload({ onFileChange, hasError = false }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dropError, setDropError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setDropError(null);

      if (rejected.length > 0) {
        const code = rejected[0].errors[0].code;
        if (code === 'file-too-large') {
          setDropError(`File exceeds ${MAX_SIZE_MB} MB limit.`);
        } else {
          setDropError('Only image files are accepted.');
        }
        return;
      }

      if (accepted.length === 0) return;

      const file = accepted[0];
      setFileName(file.name);
      onFileChange(file);

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [onFileChange],
  );

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    setDropError(null);
    onFileChange(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
  });

  /* ── Preview state ──────────────────────────────── */
  if (preview) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-line bg-[var(--surface-1)]">
        <img
          src={preview}
          alt="Incident preview"
          className="w-full max-h-72 object-cover"
        />
        {/* Overlay bar */}
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-4 py-2.5 bg-[var(--surface-2)] border-t border-line">
          <span className="text-xs text-secondary truncate max-w-[60%]">{fileName}</span>
          <button
            type="button"
            id="image-upload-remove-btn"
            onClick={handleRemove}
            className="text-xs font-semibold text-red-500 hover:text-red-650 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  /* ── Drop zone ──────────────────────────────────── */
  return (
    <div>
      <div
        {...getRootProps()}
        id="image-upload-dropzone"
        className={[
          'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-6 cursor-pointer transition-all duration-150 text-center focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
          isDragActive
            ? 'border-primary-500 bg-primary-500/10 scale-[1.01]'
            : hasError || dropError
            ? 'border-red-500/60 bg-red-500/5 hover:border-red-400'
            : 'border-line bg-[var(--surface-1)] hover:border-primary-500 hover:bg-primary-500/5 dark:hover:bg-primary-950/5',
        ].join(' ')}
        aria-label="Image upload drop zone"
      >
        <input {...getInputProps()} id="image-upload-input" />

        {/* Upload icon */}
        <div
          className={[
            'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
            isDragActive ? 'bg-primary-500/20' : 'bg-[var(--surface-2)] border border-line',
          ].join(' ')}
        >
          <svg
            aria-hidden="true"
            className={`w-6 h-6 ${isDragActive ? 'text-primary-500' : 'text-muted'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>

        {isDragActive ? (
          <p className="text-sm font-medium text-primary-500">Drop the image here…</p>
        ) : (
          <>
            <div>
              <p className="text-sm font-medium text-secondary">
                Drag & drop an image, or{' '}
                <span className="text-primary-600 dark:text-primary-400 underline underline-offset-2">browse</span>
              </p>
              <p className="text-xs text-muted mt-1">
                JPG, PNG, WebP, GIF · max {MAX_SIZE_MB} MB
              </p>
            </div>
          </>
        )}
      </div>

      {dropError && (
        <p role="alert" className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
          <svg aria-hidden="true" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 9a1 1 0 0 0 0 2v3a1 1 0 0 0 2 0v-3a1 1 0 0 0-1-1H9z" clipRule="evenodd" />
          </svg>
          {dropError}
        </p>
      )}
    </div>
  );
}
