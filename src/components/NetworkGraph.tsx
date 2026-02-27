import { motion } from "framer-motion";
import { useMemo } from "react";
import type { GraphNode, GraphLink } from "@/lib/analyzer";

interface NetworkGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

const NetworkGraph = ({ nodes, links }: NetworkGraphProps) => {
  const positions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    const centerX = 250;
    const centerY = 200;

    // Identity at center
    pos["identity"] = { x: centerX, y: centerY };

    // Platforms in a circle
    const platformNodes = nodes.filter((n) => n.type === "platform");
    const breachNode = nodes.find((n) => n.type === "breach");

    platformNodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / platformNodes.length - Math.PI / 2;
      const radius = 140;
      pos[node.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });

    if (breachNode) {
      pos[breachNode.id] = { x: centerX, y: centerY + 155 };
    }

    return pos;
  }, [nodes]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card rounded-xl p-4 overflow-hidden"
    >
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 px-2">
        Identity Graph
      </h3>
      <svg viewBox="0 0 500 400" className="w-full h-auto">
        {/* Links */}
        {links.map((link, i) => {
          const from = positions[link.source];
          const to = positions[link.target];
          if (!from || !to) return null;
          return (
            <motion.line
              key={i}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke="hsl(var(--primary))"
              strokeOpacity={link.strength * 0.5}
              strokeWidth={1.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos = positions[node.id];
          if (!pos) return null;

          const isIdentity = node.type === "identity";
          const isBreach = node.type === "breach";
          const isMatched = node.matched;
          const r = isIdentity ? 24 : isBreach ? 18 : 14;

          let fill = "hsl(var(--muted))";
          if (isIdentity) fill = "hsl(var(--primary))";
          else if (isBreach) fill = "hsl(var(--destructive))";
          else if (isMatched) fill = "hsl(var(--lavender))";

          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
            >
              {isIdentity && (
                <circle cx={pos.x} cy={pos.y} r={r + 6} fill="none" stroke={fill} strokeOpacity={0.2} strokeWidth={2} className="animate-pulse-ring" />
              )}
              <circle cx={pos.x} cy={pos.y} r={r} fill={fill} fillOpacity={isMatched || isIdentity || isBreach ? 0.85 : 0.3} />
              <text
                x={pos.x}
                y={pos.y + r + 14}
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize={isIdentity ? 11 : 9}
                fontWeight={isIdentity ? 600 : 400}
                fontFamily="Inter, sans-serif"
              >
                {node.label}
              </text>
              {node.confidence && node.confidence > 0 && (
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill="hsl(var(--primary-foreground))"
                  fontSize={8}
                  fontWeight={500}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.confidence}%
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
};

export default NetworkGraph;
