import { motion } from "framer-motion";

const LoadingAnimation = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center gap-4 py-20"
  >
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
    </div>
    <div className="text-sm text-muted-foreground">Scanning platforms...</div>
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </motion.div>
);

export default LoadingAnimation;
