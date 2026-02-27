import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield } from "lucide-react";

interface SearchInputProps {
  onAnalyze: (username: string, name?: string, email?: string) => void;
  isLoading: boolean;
}

const SearchInput = ({ onAnalyze, isLoading }: SearchInputProps) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) onAnalyze(username.trim(), name.trim() || undefined, email.trim() || undefined);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Trace<span className="text-gradient">Era</span>
        </h1>
      </div>
      <p className="text-muted-foreground text-sm max-w-md text-center">
        Simulated digital footprint audit engine. Enter a username to analyze its presence across platforms.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
        {/* Username (required) */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username *"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            disabled={isLoading}
          />
        </div>

        {/* Optional fields row */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name (optional)"
            className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            disabled={isLoading}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          className="w-full px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
    </motion.div>
  );
};

export default SearchInput;
