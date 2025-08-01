'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Search, Star, Trash2, Loader2, ChevronDown, TrendingUp } from 'lucide-react';
import { UserTemplate } from '@/lib/carousel-suggestions';
import { getUserTemplates, deleteUserTemplate, updateUserTemplate } from '@/lib/user-templates'; 
import { getDefaultTemplates } from '@/lib/carousel-suggestions';
import { useUser } from '@clerk/nextjs';


function TemplateCard({ template, onSelect, onDelete, isUserTemplate }: { template: UserTemplate, onSelect: (t: UserTemplate) => void, onDelete: (id: string) => void, isUserTemplate: boolean }) {
  const getTemplateIcon = (purpose: string) => {
    switch (purpose?.toLowerCase()) {
      case 'educate': return <BookOpen className="h-4 w-4" />;
      case 'sell': return <TrendingUp className="h-4 w-4" />;
      case 'inspire': return <Star className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <Card className="flex flex-col h-full w-full bg-glass backdrop-blur-sm border-white/10 hover:bg-white/5 hover:border-white/20 transition-all">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base font-bold text-gray-50">{template.name}</CardTitle>
          <Badge className="flex items-center gap-1 shrink-0 bg-blue-500/20 text-blue-300 border-blue-400/30">
            {getTemplateIcon(template.purpose)}
            {template.purpose}
          </Badge>
        </div>
        <CardDescription className="text-gray-200 line-clamp-2">{template.mainTopic}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end pt-0">
        <p className="text-xs text-gray-300 mb-3">For: {template.audience}</p>
        <div className="flex items-center gap-2">
          <Button onClick={() => onSelect(template)} size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            Use Template
          </Button>
          {isUserTemplate && (
            <Button
              variant="destructive"
              size="icon"
              className="shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure?')) {
                  onDelete(template.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


export function TemplateSelector({ open, onOpenChange, onTemplateSelect }: { open: boolean, onOpenChange: (o: boolean) => void, onTemplateSelect: (t: UserTemplate) => void }) {
  const [templates, setTemplates] = useState<UserTemplate[]>([]);
  const [recentTemplates, setRecentTemplates] = useState<UserTemplate[]>([]);
  const [isRecentCollapsed, setIsRecentCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useUser();

  const updateRecentTemplates = (template: UserTemplate) => {
    try {
      let ids = JSON.parse(localStorage.getItem('recentTemplates') || '[]');
      if (!Array.isArray(ids)) ids = [];
      ids = [template.id, ...ids.filter((id: string) => id !== template.id)].slice(0, 3);
      localStorage.setItem('recentTemplates', JSON.stringify(ids));
      
      const foundTemplates = ids
        .map((id: string) => templates.find(t => t.id === id))
        .filter(Boolean) as UserTemplate[];
      setRecentTemplates(foundTemplates);
    } catch (e) {
      console.error("Failed to update recent templates in localStorage", e);
    }
  };

  useEffect(() => {
    if (open) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const defaultTemplates = await getDefaultTemplates();
          let userTemplates: UserTemplate[] = [];
          if (user?.id) {
            userTemplates = await getUserTemplates(user.id) as any;
          }
          const allTemplates = [...defaultTemplates, ...userTemplates];
          setTemplates(allTemplates);
          
          const recentIds = JSON.parse(localStorage.getItem('recentTemplates') || '[]') as string[];
          const foundRecents = recentIds.map(id => allTemplates.find(t => t.id === id)).filter(Boolean) as UserTemplate[];
          setRecentTemplates(foundRecents);

        } catch (error) {
          console.error("Failed to load templates:", error);
          setTemplates(await getDefaultTemplates());
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [open, user]);
  
  const handleTemplateSelect = async (template: UserTemplate) => {
    if (template.user_id && user?.id === template.user_id) {
        // Note: usageCount tracking removed as it's not in database schema
        // updateUserTemplate(template.id, { usageCount: (template.usageCount || 0) + 1 }).catch(console.error);
    }
    updateRecentTemplates(template);
    onTemplateSelect(template);
    onOpenChange(false);
  }

  const handleDelete = async (templateId: string) => {
    if (!user?.id) return; 
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    try {
      await deleteUserTemplate(templateId);
    } catch (error) {
      alert("Failed to delete template.");
    }
  };
  
  const categories = useMemo(() => ['All', ...Array.from(new Set(templates.map(t => t.category)))], [templates]);
  
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const isRecent = recentTemplates.some(rt => rt.id === t.id);
      if(isRecent && selectedCategory === 'All' && !search) return false;

      const categoryMatch = selectedCategory === 'All' || t.category === selectedCategory;
      const searchMatch = search.trim() === '' || t.name.toLowerCase().includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [templates, selectedCategory, search, recentTemplates]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[calc(100vh-8rem)] w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:w-[90vw] lg:w-[92vw] xl:w-[94vw] 2xl:w-[96vw] max-w-none bg-glass backdrop-blur-xl border-white/10 text-gray-50 p-0 flex flex-col fixed top-135 left-1/2 transform -translate-x-1/2">
        <DialogHeader className="p-4 pb-3 border-b border-white/10">
          <DialogTitle className="text-xl text-gray-50">Template Library</DialogTitle>
          <DialogDescription className="text-gray-200 text-sm">Select a pre-made template or one of your own to get started quickly.</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          <aside className="w-48 h-full overflow-y-auto bg-white/5 border-r border-white/10 p-3 space-y-1">
            <h4 className="text-sm font-semibold text-gray-300 px-2 pt-1 pb-2">Categories</h4>
            {categories.map(category => (
              <Button 
                key={category} 
                variant="ghost"
                onClick={() => setSelectedCategory(category)}
                className={`w-full justify-between text-sm font-normal px-2 py-1.5 h-auto ${selectedCategory === category ? 'bg-blue-500/30 text-blue-200 hover:bg-blue-500/40' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
              >
                <span>{category}</span>
                <span className="text-xs opacity-60">{templates.filter(t => category === 'All' || t.category === category).length}</span>
              </Button>
            ))}
          </aside>

          <main className="flex-1 h-full flex flex-col">
            <div className="px-4 py-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search templates..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 bg-white/5 border-white/20 text-gray-100 placeholder:text-gray-400 h-9 focus:border-blue-400/50 focus:ring-blue-400/30"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Loader2 className="animate-spin h-8 w-8" />
                  </div>
                ) : (
                  <>
                    {recentTemplates.length > 0 && selectedCategory === 'All' && !search && (
                      <section>
                         <button
                          className="w-full flex justify-between items-center text-left text-lg font-bold mb-4"
                          onClick={() => setIsRecentCollapsed(!isRecentCollapsed)}
                        >
                          <span>Recently Used</span>
                          <motion.div animate={{ rotate: isRecentCollapsed ? -90 : 0 }}>
                            <ChevronDown className="h-5 w-5 transition-transform" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {!isRecentCollapsed && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="grid gap-4 justify-center grid-cols-[repeat(auto-fill,minmax(300px,320px))]">
                                {recentTemplates.map(template => (
                                  <TemplateCard 
                                    key={template.id + '-recent'}
                                    template={template} 
                                    onSelect={handleTemplateSelect} 
                                    onDelete={handleDelete} 
                                    isUserTemplate={!!template.user_id && template.user_id === user?.id}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </section>
                    )}

                    <section>
                      <h2 className="text-lg font-bold mb-4">
                        {selectedCategory === 'All' ? 'All Templates' : `${selectedCategory} Templates`}
                      </h2>
                      {filteredTemplates.length > 0 ? (
                        <div className="grid gap-4 justify-center grid-cols-[repeat(auto-fill,minmax(300px,320px))]">
                            {filteredTemplates.map(template => (
                                <TemplateCard 
                                  key={template.id} 
                                  template={template} 
                                  onSelect={handleTemplateSelect} 
                                  onDelete={handleDelete} 
                                  isUserTemplate={!!template.user_id && template.user_id === user?.id}
                                />
                            ))}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500 min-h-[200px]">
                            <div className="text-center">
                                <p className="text-lg font-semibold">No templates found</p>
                                <p className="text-sm">Try adjusting your search or category.</p>
                            </div>
                        </div>
                      )}
                    </section>
                  </>
                )}
            </div>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
} 