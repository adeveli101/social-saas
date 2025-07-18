'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Sparkles, Check, AlertCircle, Loader2 } from 'lucide-react';
import { UserTemplate } from '@/lib/carousel-suggestions';
import { saveUserTemplate } from '@/lib/user-templates';
import { useUser } from '@clerk/nextjs';


interface TemplateSaveDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  formState: {
    mainPrompt: string;
    audience: string;
    purpose: string;
    keyPoints: string[];
  };
  onTemplateSaved?: (template: UserTemplate) => void;
}

export function TemplateSaveDialog({ isOpen, onOpenChange, formState, onTemplateSaved }: TemplateSaveDialogProps) {
  const [templateName, setTemplateName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const { user } = useUser();

  const handleSave = async () => {
    if (!user?.id) {
      setError("You must be signed in to save templates.");
      return;
    }
    if (!templateName.trim()) {
      setError('Template name is required.');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      const newTemplate = await saveUserTemplate({
        name: templateName.trim(),
        mainTopic: formState.mainPrompt,
        audience: formState.audience,
        purpose: formState.purpose,
        keyPoints: formState.keyPoints,
        category: 'General' // Simplified for now
      }, user.id);
      
      setIsSaved(true);
      onTemplateSaved?.(newTemplate);
      
      setTimeout(() => {
        onOpenChange(false);
        // Reset state after a delay
        setTimeout(() => {
            setIsSaved(false);
            setTemplateName('');
            setError('');
        }, 300)
      }, 1500);

    } catch (err) {
      setError('Failed to save template.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-glass backdrop-blur-xl border-white/10 text-gray-50 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-50">
            <Sparkles className="h-5 w-5 text-blue-400" />
            Save as Template
          </DialogTitle>
          <DialogDescription className="text-gray-200">
            Save the current configuration as a reusable template.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="templateName" className="text-gray-200">Template Name</Label>
            <Input
              id="templateName"
              placeholder="e.g. Weekly Marketing Tips"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="bg-white/5 border-white/20 text-gray-100 placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/30"
            />
          </div>

          <div className="space-y-2">
             <Label className="text-gray-200">Preview</Label>
             <div className="p-3 bg-white/5 rounded-lg space-y-1 text-sm text-gray-200 border border-white/10">
               <p><strong>Topic:</strong> {formState.mainPrompt || "Not set"}</p>
               <p><strong>Audience:</strong> {formState.audience}</p>
             </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

           {isSaved && (
            <div className="flex items-center gap-2 text-emerald-300">
              <Check className="h-4 w-4" />
              <p>Template saved!</p>
            </div>
          )}

        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving} className="text-gray-300 hover:bg-white/10 hover:text-white">Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || !templateName.trim()} className="bg-blue-500 hover:bg-blue-600 text-white">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {isSaving ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 