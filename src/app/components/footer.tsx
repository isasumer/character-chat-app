import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="text-center text-sm text-[var(--muted-foreground)] mt-8"
    >
      Character Chat App v1.0.0
    </motion.p>
  );
}
