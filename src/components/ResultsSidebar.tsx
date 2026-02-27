import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Shield, Info, Mail } from "lucide-react";
import type { AnalysisResult } from "@/lib/analyzer";

interface ResultsSidebarProps {
  result: AnalysisResult;
}

const ResultsSidebar = ({ result }: ResultsSidebarProps) => {
  const matched = result.platforms.filter((p) => p.matched);
  const unmatched = result.platforms.filter((p) => !p.matched);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-1"
    >
      {/* Variations */}
      <Section title="Username Variations">
        <div className="flex flex-wrap gap-1.5">
          {result.variations.map((v) => (
            <span key={v} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-mono">
              {v}
            </span>
          ))}
        </div>
      </Section>

      {/* Discovered Emails */}
      {result.discovered_emails.length > 0 && (
        <Section title={`Discovered Emails (${result.discovered_emails.length})`}>
          <div className="space-y-1">
            {result.discovered_emails.map((email) => (
              <div key={email} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-secondary/50">
                <Mail className="h-3 w-3 text-accent shrink-0" />
                <span className="text-xs font-mono text-foreground">{email}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Matched Platforms */}
      <Section title={`Matched Platforms (${matched.length})`}>
        <div className="space-y-2">
          {matched.map((p) => (
            <div key={p.name} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/50">
              <CheckCircle className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{p.name}</span>
                  <span className="text-[10px] font-mono text-primary">{p.confidence}%</span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{p.metadata}</p>
                {p.email_found && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Mail className="h-2.5 w-2.5 text-accent" />
                    <span className="text-[10px] font-mono text-accent">{p.email_found}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {unmatched.length > 0 && (
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
              <XCircle className="h-3 w-3" />
              No match: {unmatched.map((p) => p.name).join(", ")}
            </div>
          )}
        </div>
      </Section>

      {/* Vulnerabilities */}
      <Section title="Vulnerabilities">
        <div className="space-y-2">
          {result.vulnerabilities.map((v, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/50">
              {v.severity === "high" ? (
                <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
              ) : v.severity === "medium" ? (
                <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
              ) : (
                <Info className="h-3.5 w-3.5 text-soft-blue mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-foreground">{v.title}</span>
                <p className="text-[11px] text-muted-foreground">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Remediation */}
      <Section title="Remediation Steps">
        <div className="space-y-1.5">
          {result.remediation.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px]">
              <Shield className="h-3 w-3 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{r}</span>
            </div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="glass-card rounded-xl p-4">
    <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{title}</h3>
    {children}
  </div>
);

export default ResultsSidebar;
