import PassportIdPage from '@/app/curbos/components/passport/PassportIdPage';
import PassportStampsPage from '@/app/curbos/components/passport/PassportStampsPage';
import { motion } from 'framer-motion';
import { Customer } from '../types';

interface QuestBookletProps {
    customer: Customer;
}

export function QuestBooklet({ customer }: QuestBookletProps) {
    return (
        <motion.div
            initial={{ rotateX: 20, opacity: 0, y: 50 }}
            animate={{ rotateX: 0, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex flex-row shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden mb-12 transform-gpu w-full max-w-[900px] mx-auto aspect-[1.408/1] bg-[#fdfbf7] relative"
        >
            {/* Left Page (ID - Portrait) */}
            <div className="flex-1 w-1/2 min-w-0 h-full relative z-10">
                <PassportIdPage customer={customer} />
                {/* Inner Shadow for Left Page Fold */}
                <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Center Spine Binding Effect */}
            <div className="absolute inset-y-0 left-1/2 w-[2px] -ml-[1px] bg-black/20 z-30"></div>
            <div className="absolute inset-y-0 left-1/2 w-16 -ml-8 z-20 pointer-events-none bg-gradient-to-r from-transparent via-black/10 to-transparent mix-blend-multiply"></div>

            {/* Right Page (Stamps - Portrait) */}
            <div className="flex-1 w-1/2 min-w-0 h-full relative z-0">
                {/* Inner Shadow for Right Page Fold */}
                <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-10"></div>

                <PassportStampsPage
                    unlockedRegions={customer.unlocked_regions || []}
                    stampCards={customer.stamp_cards || {}}
                />
            </div>
        </motion.div>
    );
}
