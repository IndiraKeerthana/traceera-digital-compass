import { motion } from "framer-motion";
import { useMemo } from "react";

const NetworkGraph = ({ nodes = [], links = [] }: any) => {

  const positions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    const centerX = 250;
    const centerY = 200;

    if (!nodes || nodes.length === 0) return pos;

    // Identity node (center)
    const identityNode = nodes.find((n: any) => n.type === "identity");
    if (identityNode) {
      pos[identityNode.id] = { x: centerX, y: centerY };
    }

    // Platform nodes (circular around identity)
    const platformNodes = nodes.filter((n: any) => n.type === "platform");

    platformNodes.forEach((node: any, i: number) => {
      const angle =
        (2 * Math.PI * i) / platformNodes.length - Math.PI / 2;
      const radius = 130;

      pos[node.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });

    // Attribute nodes (below identity)
    const attributeNodes = nodes.filter((n: any) => n.type === "attribute");

    attributeNodes.forEach((node: any, i: number) => {
      pos[node.id] = {
        x: centerX + (i % 2 === 0 ? -100 : 100),
        y: centerY + 140,
      };
    });

    return pos;
  }, [nodes]);

  if (!nodes || nodes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl p-6 bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl"
    >
      <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Identity Correlation Map
      </h3>

      <svg viewBox="0 0 500 400" className="w-full h-auto">

        {/* Links */}
        {links.map((link: any, i: number) => {
          const from = positions[link.source];
          const to = positions[link.target];
          if (!from || !to) return null;

          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#94a3b8"
              strokeOpacity={0.3}
              strokeWidth={1.5}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node: any) => {
          const pos = positions[node.id];
          if (!pos) return null;

          const isIdentity = node.type === "identity";
          const isAttribute = node.type === "attribute";

          return (
            <g key={node.id}>
              {/* Identity glow */}
              {isIdentity && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={28}
                  fill="#a855f7"
                  fillOpacity={0.1}
                  className="animate-pulse"
                />
              )}

              <circle
                cx={pos.x}
                cy={pos.y}
                r={isIdentity ? 18 : isAttribute ? 10 : 12}
                fill={
                  isIdentity
                    ? "#a855f7"
                    : isAttribute
                    ? "#fbbf24"
                    : "#3b82f6"
                }
              />

              <text
                x={pos.x}
                y={pos.y + 28}
                textAnchor="middle"
                fill="white"
                fontSize="10"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
};

export default NetworkGraph;