import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Search, Sparkles, X } from 'lucide-react';
import React from 'react';

interface SpecialsHeaderProps {
  inputInternal: string;
  setInputInternal: (val: string) => void;
  ingredients: string[];
  removeIngredient: (ing: string) => void;
  activeSearch: (term: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  onCameraClick: () => void;
  isAuthenticated: boolean;
}

export function SpecialsHeader({
  inputInternal,
  setInputInternal,
  ingredients,
  removeIngredient,
  activeSearch,
  handleKeyDown,
  onCameraClick,
  isAuthenticated
}: SpecialsHeaderProps) {
  return (
    <div className="mx-auto max-w-7xl pt-8 pb-12 desktop:pt-16 desktop:pb-20">
        <div className="relative text-center">

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-8 flex justify-center"
            >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1f1f1f] border border-[#2a2a2a] shadow-lg shadow-black/40">
                    <Sparkles size={32} className="text-landing-primary" />
                </div>
            </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 text-4xl font-bold tracking-tight text-white desktop:text-6xl"
          >
            What&apos;s in your kitchen?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
             className="mx-auto mb-10 max-w-2xl text-lg text-white/60"
          >
            Enter ingredients or describe what you want to eat (e.g. &quot;Spicy vegetarian dinner&quot;).
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mb-8 max-w-lg rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-xl shadow-black/10"
          >
             <p className="text-sm text-white/70 italic text-center">
               <span className="not-italic font-semibold text-landing-primary mr-2 block mb-1">⚠️ Chef&apos;s Disclaimer</span>
               &quot;For when your creativity has been 86&apos;d.&quot;<br/>
               <span className="opacity-60 text-xs mt-1 block">These are AI suggestions based on your stock—season to taste!</span>
             </p>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
            className="mx-auto flex max-w-3xl flex-wrap items-center rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 shadow-2xl shadow-black/20 focus-within:border-landing-primary/50 focus-within:ring-2 focus-within:ring-landing-primary/20 transition-all duration-300"
          >
             <Search className="ml-4 mr-3 h-5 w-5 text-white/40" />

             <div className="flex flex-1 flex-wrap items-center gap-2">
                <AnimatePresence>
                    {ingredients.map(ing => (
                        <motion.span
                          key={ing}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1.5 rounded-lg bg-[#2a2a2a] pl-3 pr-2 py-1.5 text-sm font-medium text-white border border-[#3a3a3a]"
                        >
                            {ing}
                            <button onClick={() => removeIngredient(ing)} className="rounded p-0.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                                <X size={14} />
                            </button>
                        </motion.span>
                    ))}
                </AnimatePresence>
                 <input
                  value={inputInternal}
                  onChange={(e) => setInputInternal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={ingredients.length === 0 ? "Type ingredients or a phrase..." : "Add more..."}
                  className="min-w-[200px] flex-1 border-none bg-transparent py-3 text-lg text-white placeholder-white/20 focus:outline-none focus:ring-0"
                />
             </div>

             <button
                onClick={onCameraClick}
                className="mr-2 rounded-xl p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                title={isAuthenticated ? "Upload photo of ingredients" : "Log in to use kitchen scanner"}
             >
                <Camera size={20} />
             </button>

             {inputInternal.length > 3 && (
                 <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => activeSearch(inputInternal)}
                    className="mr-2 rounded-xl bg-landing-primary/10 px-4 py-2 text-sm font-medium text-landing-primary hover:bg-landing-primary/20 transition-colors flex items-center gap-2"
                 >
                     <Sparkles size={16} />
                     Ask AI
                 </motion.button>
             )}
          </motion.div>
        </div>
      </div>
  );
}
