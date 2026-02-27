export interface Platform {
  name: string;
  matched: boolean;
  confidence: number;
  metadata: string;
  icon: string;
}

export interface BreachExposure {
  email_found: boolean;
  location_exposed: boolean;
  password_leaked: boolean;
  phone_exposed: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "identity" | "platform" | "breach";
  matched?: boolean;
  confidence?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number;
}

export interface Vulnerability {
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
}

export interface AnalysisResult {
  username: string;
  variations: string[];
  nodes: GraphNode[];
  links: GraphLink[];
  risk_score: number;
  platforms: Platform[];
  breach: BreachExposure;
  vulnerabilities: Vulnerability[];
  remediation: string[];
}

const PLATFORM_CONFIG = [
  { name: "GitHub", icon: "github", metaTemplates: ["Active since 2019 · {n} repos", "Last commit: 3 days ago", "Bio: Full-stack developer"] },
  { name: "LinkedIn", icon: "linkedin", metaTemplates: ["Software Engineer at TechCorp", "500+ connections · Bay Area", "Open to opportunities"] },
  { name: "Twitter (X)", icon: "twitter", metaTemplates: ["{n} followers · Joined 2020", "Last post: 2 hours ago", "Bio: Tech enthusiast"] },
  { name: "Instagram", icon: "instagram", metaTemplates: ["{n} posts · {m} followers", "Public account · Last active today", "Photography & travel"] },
  { name: "Facebook", icon: "facebook", metaTemplates: ["Profile found · Limited visibility", "Joined 2015 · {n} friends", "Lives in Seattle, WA"] },
  { name: "Reddit", icon: "reddit", metaTemplates: ["{n} karma · Active in r/programming", "Account age: 4 years", "Moderator of 2 subreddits"] },
  { name: "Discord", icon: "discord", metaTemplates: ["Member of {n} servers", "Account created 2021", "Active in tech communities"] },
  { name: "Pinterest", icon: "pinterest", metaTemplates: ["{n} pins · {m} boards", "Interest: technology, design", "Active monthly user"] },
  { name: "Medium", icon: "medium", metaTemplates: ["{n} articles published", "Focus: cybersecurity, privacy", "Member since 2020"] },
  { name: "Breach Dataset", icon: "breach", metaTemplates: ["Found in {n} breach(es)", "Last breach: 2023", "Credential exposure detected"] },
];

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateVariations(username: string): string[] {
  const base = username.toLowerCase().replace(/[^a-z0-9]/g, "");
  return [
    username,
    `${base}_dev`,
    `${base}${rand(1, 99)}`,
    `the_${base}`,
    `${base}.official`,
  ];
}

function generateMeta(templates: string[]): string {
  const template = templates[rand(0, templates.length - 1)];
  return template
    .replace("{n}", String(rand(5, 500)))
    .replace("{m}", String(rand(50, 5000)));
}

export function analyzeUsername(username: string): AnalysisResult {
  const variations = generateVariations(username);

  const platforms: Platform[] = PLATFORM_CONFIG.map((p) => {
    const matched = Math.random() > 0.35;
    return {
      name: p.name,
      matched,
      confidence: matched ? rand(60, 95) : 0,
      metadata: matched ? generateMeta(p.metaTemplates) : "",
      icon: p.icon,
    };
  });

  const breach: BreachExposure = {
    email_found: Math.random() > 0.35,
    location_exposed: Math.random() > 0.4,
    password_leaked: Math.random() > 0.45,
    phone_exposed: Math.random() > 0.4,
  };

  // Risk score
  let risk = 0;
  if (breach.email_found) risk += 20;
  if (breach.location_exposed) risk += 15;
  if (breach.password_leaked) risk += 50;
  if (breach.phone_exposed) risk += 15;

  const matchedPlatforms = platforms.filter((p) => p.matched);
  risk += Math.min(matchedPlatforms.reduce((sum, p) => sum + p.confidence * 0.05, 0), 15);
  risk = Math.min(Math.round(risk), 100);

  // Graph
  const nodes: GraphNode[] = [
    { id: "identity", label: username, type: "identity" },
    ...platforms.map((p) => ({
      id: p.name.toLowerCase().replace(/[^a-z]/g, ""),
      label: p.name,
      type: "platform" as const,
      matched: p.matched,
      confidence: p.confidence,
    })),
    { id: "breach", label: "Breach Data", type: "breach" },
  ];

  const links: GraphLink[] = [
    ...platforms
      .filter((p) => p.matched)
      .map((p) => ({
        source: "identity",
        target: p.name.toLowerCase().replace(/[^a-z]/g, ""),
        strength: p.confidence / 100,
      })),
    ...(breach.email_found || breach.password_leaked
      ? [{ source: "identity", target: "breach", strength: 0.9 }]
      : []),
  ];

  // Vulnerabilities
  const vulns: Vulnerability[] = [];
  if (breach.password_leaked) vulns.push({ severity: "high", title: "Password Exposed in Data Breach", description: "Credentials found in known breach databases. Immediate password change recommended." });
  if (breach.email_found) vulns.push({ severity: "medium", title: "Email Address Publicly Linked", description: "Email associated with multiple platforms increases phishing risk." });
  if (breach.location_exposed) vulns.push({ severity: "medium", title: "Location Data Exposed", description: "Physical location information found across platform profiles." });
  if (breach.phone_exposed) vulns.push({ severity: "medium", title: "Phone Number Discoverable", description: "Phone number linked to online accounts enables SIM-swap attacks." });
  if (matchedPlatforms.length > 5) vulns.push({ severity: "low", title: "High Platform Correlation", description: "Username reuse across many platforms enables easy identity linking." });
  if (matchedPlatforms.length > 0) vulns.push({ severity: "low", title: "Digital Footprint Detected", description: `Username matched on ${matchedPlatforms.length} platform(s) with varying confidence.` });

  const remediation: string[] = [];
  if (breach.password_leaked) remediation.push("Change all passwords immediately and enable 2FA on all accounts.");
  if (breach.email_found) remediation.push("Use email aliases or masked emails for different services.");
  if (breach.location_exposed) remediation.push("Review privacy settings and remove location data from public profiles.");
  if (breach.phone_exposed) remediation.push("Contact your carrier to add a SIM-swap protection PIN.");
  if (matchedPlatforms.length > 3) remediation.push("Use unique usernames across platforms to reduce correlation.");
  remediation.push("Regularly audit your digital footprint using privacy tools.");
  remediation.push("Enable login notifications on all critical accounts.");

  return { username, variations, nodes, links, risk_score: risk, platforms, breach, vulnerabilities: vulns, remediation };
}
