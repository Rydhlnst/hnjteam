"use client";

import { useCallback, useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";

type Props = {
  existingUrl?: string | null;
};

export function ImageDropzone({ existingUrl }: Props) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const [dragging, setDragging] = useState(false);
  const [removed, setRemoved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const applyFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setRemoved(false);
    const url = URL.createObjectURL(file);
    setPreview(url);
    // Inject the file into the real input so it's included in FormData
    const dt = new DataTransfer();
    dt.items.add(file);
    if (inputRef.current) inputRef.current.files = dt.files;
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) applyFile(file);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };
  const onRemove = () => {
    setPreview(null);
    setRemoved(true);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {/* Real file input — hidden, part of the form's FormData */}
      <input ref={inputRef} type="file" name="image" accept="image/*" className="sr-only" onChange={onChange} />
      {/* Signal to server action whether the existing image should be deleted */}
      <input type="hidden" name="_removeImage" value={removed ? "true" : "false"} />

      {preview ? (
        <div className="relative overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Product preview" className="h-48 w-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={[
            "flex h-44 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-colors",
            dragging
              ? "border-[#171716] bg-[#f0f0ec]"
              : "border-[#deded9] bg-[#fafaf8] hover:border-[#c0c0bc] hover:bg-[#f0f0ec]",
          ].join(" ")}
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#efefec]">
            {dragging ? (
              <ImageIcon className="size-5 text-[#171716]" />
            ) : (
              <Upload className="size-5 text-[#858580]" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#171716]">
              {dragging ? "Drop to upload" : "Drop image here or click to browse"}
            </p>
            <p className="mt-0.5 text-xs text-[#858580]">PNG, JPG, WebP · converted to WebP · max 10 MB</p>
          </div>
        </button>
      )}
    </div>
  );
}
