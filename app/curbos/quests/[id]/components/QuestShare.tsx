import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';

export function QuestShare() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-12 pb-4 text-center"
        >
            <button className="text-neutral-500 text-xs flex items-center justify-center gap-2 mx-auto hover:text-[#ccff00] transition-colors">
                <Share2 size={12} /> Share my Passport
            </button>
        </motion.div>
    );
}
