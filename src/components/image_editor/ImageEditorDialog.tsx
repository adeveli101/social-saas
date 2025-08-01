// src/components/image_editor/ImageEditorDialog.tsx
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImageEditor } from './ImageEditor';

interface ImageEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  imageUrl: string | null;
}

export const ImageEditorDialog = ({ isOpen, onClose, onSave, imageUrl }: ImageEditorDialogProps) => {
  if (!imageUrl) {
    return null; // Eğer düzenlenecek bir görsel yoksa, hiçbir şey render etme
  }

  const handleSaveAndClose = (dataUrl: string) => {
    onSave(dataUrl);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-fit p-0 border-0">
                <ImageEditor
          imageUrl={imageUrl}
          onSave={handleSaveAndClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}; 