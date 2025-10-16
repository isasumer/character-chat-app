import { featuresMap } from '../../../constants';
import { motion } from 'framer-motion';

export default function Features() {
  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="grid grid-cols-3 gap-4 mb-8"
  >
    {featuresMap.map((feature, index) => (
      <motion.div
        key={feature.text}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 + index * 0.1 }}
        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-[var(--border)]"
      >
        <feature.icon className="w-6 h-6 text-[var(--primary)]" />
        <span className="text-xs text-center text-[var(--muted-foreground)]">
          {feature.text}
        </span>
      </motion.div>
    ))}
  </motion.div>
  );
}