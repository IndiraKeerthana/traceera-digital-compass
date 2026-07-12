import { useState } from "react";
import { motion } from "framer-motion";
import { Search, User, Mail } from "lucide-react";

interface SearchInputProps {
  onAnalyze: (data: {
    username: string;
    name?: string;
    email?: string;
  }) => void;
  isLoading: boolean;
}

const SearchInput = ({ onAnalyze, isLoading }: SearchInputProps) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) return;

    onAnalyze({
      username: username.trim().toLowerCase(),
      name: name.trim() || undefined,
      email: email.trim() || undefined
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      {/* Username (Required) */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Username (required)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all"
        />
      </div>

      {/* Name (Optional) */}
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Full Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all"
        />
      </div>

      {/* Email (Optional) */}
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !username.trim()}
        className="py-3 rounded-2xl bg-gradient-to-r from-purple-500/70 to-blue-500/70 text-white font-semibold tracking-wide hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
      >
        {isLoading ? "Scanning..." : "Start Analysis"}
      </button>
    </motion.form>
  );
};

export default SearchInput;