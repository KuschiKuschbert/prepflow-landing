import { Icon } from '@/components/ui/Icon';
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
  isAuthenticated,
}: SpecialsHeaderProps) {
  return (
    <div className="desktop:pt-16 desktop:pb-20 mx-auto max-w-7xl pt-8 pb-12">
      <div className="relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg shadow-black/40">
            <Icon icon={Sparkles} size="xl" className="text-landing-primary" aria-hidden />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="desktop:text-6xl mb-4 text-4xl font-bold tracking-tight text-white"
        >
          What&apos;s in your kitchen?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-white/60"
        >
          Enter ingredients or describe what you want to eat (e.g. &quot;Spicy vegetarian
          dinner&quot;).
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="mx-auto mb-8 max-w-lg rounded-xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/10 backdrop-blur-sm"
        >
          <p className="text-center text-sm text-white/70 italic">
            <span className="text-landing-primary mr-2 mb-1 block font-semibold not-italic">
              ⚠️ Chef&apos;s Disclaimer
            </span>
            &quot;For when your creativity has been 86&apos;d.&quot;
            <br />
            <span className="mt-1 block text-xs opacity-60">
              These are AI suggestions based on your stock—season to taste!
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="focus-within:border-landing-primary/50 focus-within:ring-landing-primary/20 mx-auto flex max-w-3xl flex-wrap items-center rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 shadow-2xl shadow-black/20 transition-all duration-300 focus-within:ring-2"
        >
          <Icon icon={Search} size="md" className="mr-3 ml-4 text-white/40" aria-hidden />

          <div className="flex flex-1 flex-wrap items-center gap-2">
            <AnimatePresence>
              {ingredients.map(ing => (
                <motion.span
                  key={ing}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] py-1.5 pr-2 pl-3 text-sm font-medium text-white"
                >
                  {ing}
                  <button
                    onClick={() => removeIngredient(ing)}
                    className="rounded p-0.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Icon icon={X} size="xs" aria-hidden />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
            <input
              value={inputInternal}
              onChange={e => setInputInternal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                ingredients.length === 0 ? 'Type ingredients or a phrase...' : 'Add more...'
              }
              className="min-w-[200px] flex-1 border-none bg-transparent py-3 text-lg text-white placeholder-white/20 focus:ring-0 focus:outline-none"
            />
          </div>

          <button
            onClick={onCameraClick}
            className="mr-2 rounded-xl p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            title={
              isAuthenticated ? 'Upload photo of ingredients' : 'Log in to use kitchen scanner'
            }
          >
            <Icon icon={Camera} size="md" aria-hidden />
          </button>

          {inputInternal.length > 3 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => activeSearch(inputInternal)}
              className="bg-landing-primary/10 text-landing-primary hover:bg-landing-primary/20 mr-2 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              <Icon icon={Sparkles} size="sm" aria-hidden />
              Ask AI
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
