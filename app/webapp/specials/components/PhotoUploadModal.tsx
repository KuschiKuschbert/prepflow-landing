'use client';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Camera, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, prompt: string) => Promise<void>;
  isProcessing: boolean;
}

export function PhotoUploadModal({
  isOpen,
  onClose,
  onSubmit,
  isProcessing,
}: PhotoUploadModalProps) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    await onSubmit(selectedFile, prompt);
    // cleaning up state is handled by parent or onClose usually, but we can reset here if we want to reuse modal
    if (!isProcessing) {
        setSelectedFile(null);
        setPrompt('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#2a2a2a] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-landing-primary/10 text-landing-primary">
                    <Icon icon={Camera} size="md" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {t('aiSpecials.uploadTitle', 'Kitchen Scan')}
                    </h3>
                    <p className="text-xs text-white/50">
                      Upload a photo of your ingredients
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-white/50 hover:bg-[#2a2a2a] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">

                {/* File Upload Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200
                    ${
                      dragActive
                        ? 'border-landing-primary bg-landing-primary/5'
                        : 'border-[#2a2a2a] bg-[#1a1a1a] hover:border-landing-primary/50 hover:bg-[#252525]'
                    }
                    ${selectedFile ? 'border-solid border-landing-primary/50' : ''}
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="relative h-full w-full p-4 flex flex-col items-center justify-center">
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            className="max-h-[160px] rounded-lg object-contain mb-2"
                        />
                         <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                         <p className="text-xs text-white/50">Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="mb-4 rounded-full bg-[#2a2a2a] p-4">
                        <Icon icon={Upload} className="h-6 w-6 text-white/50" />
                      </div>
                      <p className="mb-1 text-sm font-medium text-white">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-white/40">
                        SVG, PNG, JPG or GIF (max. 10MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Prompt Input */}
                <div>
                   <label className="mb-2 block text-sm font-medium text-white/70">
                        {t('aiSpecials.instructions', 'Special Instructions (Optional)')}
                   </label>
                   <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. I want something spicy, or I strictly don't want any pasta."
                        className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-3 text-sm text-white placeholder-white/20 focus:border-landing-primary focus:outline-none focus:ring-1 focus:ring-landing-primary transition-all"
                        rows={3}
                   />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-[#2a2a2a] bg-transparent px-4 py-3 text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors"
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!selectedFile || isProcessing}
                        className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-landing-primary px-4 py-3 text-sm font-medium text-white hover:bg-landing-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-landing-primary/20"
                    >
                        {isProcessing ? (
                            <>
                                <Icon icon={Bot} className="animate-bounce" size="sm" />
                                Analyzing Kitchen...
                            </>
                        ) : (
                            <>
                                <Icon icon={Camera} size="sm" />
                                Generate Specials
                            </>
                        )}
                    </button>
                </div>

              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
