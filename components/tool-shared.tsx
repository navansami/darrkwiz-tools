'use client';
import { useEffect, useRef, useState } from 'react';
import { Upload, Copy, Check, LoaderCircle, Sparkles, AlertCircle, X } from 'lucide-react';
import { ACCEPT_IMAGES, demoFile, loadImage } from '@/lib/image';
export function FileDrop({
  onFiles,
  multiple = false,
  compact = false,
}: {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  compact?: boolean;
}) {
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div
      className={`file-drop ${compact ? 'compact' : ''} ${drag ? 'dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        onFiles(Array.from(e.dataTransfer.files).slice(0, multiple ? 20 : 1));
      }}
    >
      <Upload size={compact ? 18 : 27} />
      <strong>
        {compact ? 'Choose another image' : `Drop ${multiple ? 'your images' : 'an image'} here`}
      </strong>
      {!compact && (
        <>
          <span>or click to browse your files</span>
          <small>
            PNG, JPEG, WebP, AVIF · Up to 25 MB each{multiple ? ' · Max 20 images' : ''}
          </small>
        </>
      )}
      <input
        ref={input}
        type="file"
        aria-label={multiple ? 'Upload images' : 'Upload image'}
        accept={ACCEPT_IMAGES}
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files) onFiles(Array.from(e.target.files).slice(0, multiple ? 20 : 1));
          e.target.value = '';
        }}
      />
    </div>
  );
}
export function ErrorMessage({ message }: { message: string }) {
  return message ? (
    <div role="alert" className="error-message">
      <AlertCircle size={17} />
      {message}
    </div>
  ) : null;
}
export function Busy({ label = 'Working a little magic…' }: { label?: string }) {
  return (
    <span className="busy">
      <LoaderCircle size={16} />
      {label}
    </span>
  );
}
export function CopyButton({
  text,
  label = 'Copy',
  className = 'button secondary',
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <button
      disabled={!text}
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setFailed(false);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 2000);
        } catch {
          setFailed(true);
        }
      }}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}{' '}
      {failed ? 'Select text to copy' : copied ? 'Copied!' : label}
    </button>
  );
}
export function SampleButton({ onFile }: { onFile: (file: File) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="text-link sample-button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          onFile(await demoFile());
        } finally {
          setBusy(false);
        }
      }}
    >
      <Sparkles size={15} />
      {busy ? 'Making a sample…' : 'Just exploring? Try a sample'}
    </button>
  );
}
export function useImageFile() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const generation = useRef(0);
  async function selectFile(f: File) {
    const id = ++generation.current;
    setLoading(true);
    setError('');
    try {
      const img = await loadImage(f);
      if (id === generation.current) {
        setFile(f);
        setImage(img);
      }
    } catch (e) {
      if (id === generation.current)
        setError(e instanceof Error ? e.message : 'Could not read this image.');
    } finally {
      if (id === generation.current) setLoading(false);
    }
  }
  return { file, image, error, setError, loading, selectFile };
}
export function ImagePreview({
  image,
  alt = 'Your selected image',
}: {
  image: HTMLImageElement;
  alt?: string;
}) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const c = document.createElement('canvas');
    const scale = Math.min(1, 1200 / image.naturalWidth, 900 / image.naturalHeight);
    c.width = Math.round(image.naturalWidth * scale);
    c.height = Math.round(image.naturalHeight * scale);
    c.getContext('2d')!.drawImage(image, 0, 0, c.width, c.height);
    let active = true;
    let objectUrl = '';
    c.toBlob((b) => {
      if (b && active) {
        objectUrl = URL.createObjectURL(b);
        setUrl(objectUrl);
      }
    });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [image]);
  return url ? <img src={url} alt={alt} className="image-preview" /> : null;
}
