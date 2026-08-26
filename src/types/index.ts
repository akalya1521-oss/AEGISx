export type ThreatLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export type EntityType = 'IP' | 'DOMAIN' | 'CRYPTO_WALLET' | 'FILE_HASH' | 'THREAT_ACTOR' | 'BOTNET_C2' | 'UPI_VPA' | 'SIM_BOX_IMEI';

export interface GeoLocation {
  city: string;
  country: string;
  countryCode: string;
  state?: string;
  lat: number;
  lng: number;
  flagEmoji: string;
  asn: string;
  isp: string;
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  value: string;
  threatLevel: ThreatLevel;
  threatScore: number; // 0 - 100
  firstSeen: string;
  lastSeen: string;
  status: 'ACTIVE' | 'ISOLATED' | 'MONITORED' | 'NEUTRALIZED';
  reputation: string;
  geo?: GeoLocation;
  associatedGroup?: string;
  associatedCampaign?: string;
  tags: string[];
  connectionsCount: number;
  activeIncidents: number;
  jurisdictionState?: string;
  reportedToCertIn?: boolean;
  certInRefCode?: string;
  whoisData?: {
    registrar: string;
    creationDate: string;
    expirationDate: string;
    nameServers: string[];
    registrantOrg: string;
  };
  dnsHistory?: {
    date: string;
    recordType: string;
    resolvedIp: string;
  }[];
  openPorts?: number[];
  notes?: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: EntityType;
  threatLevel: ThreatLevel;
  threatScore: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  cluster: string;
  ip?: string;
  asn?: string;
  country?: string;
  state?: string;
  trafficRate?: string;
  beaconInterval?: string;
  isC2?: boolean;
  status: 'ACTIVE' | 'ISOLATED' | 'TARGET';
  details?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  type: 'C2_BEACON' | 'DATA_EXFILTRATION' | 'LATERAL_MOVEMENT' | 'CRYPTO_TRANSFER' | 'DNS_QUERY' | 'BOT_REPLICATION' | 'UPI_FRAUD_BURST';
  threatLevel: ThreatLevel;
  bandwidth?: string;
  packetCount: number;
  active: boolean;
  protocol: 'HTTPS' | 'TCP/443' | 'SSH/22' | 'DNS/53' | 'TOR' | 'WSS' | 'CUSTOM_ENC' | 'UPI/ISO8583' | 'SCADA/Modbus';
  lastActivity: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  threatLevel: ThreatLevel;
  category: 'C2_COMMUNICATION' | 'RANSOMWARE_BEACON' | 'DATA_EXFILTRATION' | 'CREDENTIAL_STUFFING' | 'CRYPTO_DRAINER' | 'ZERO_DAY_EXPLOIT' | 'UPI_MULE_BURST' | 'CNI_POWER_GRID_PROBE';
  source: string;
  sourceIp: string;
  targetIp: string;
  destinationPort: number;
  timestamp: string;
  status: 'NEW' | 'ACKNOWLEDGED' | 'ESCALATED' | 'RESOLVED' | 'DISMISSED';
  mitreTactic: string;
  mitreTechnique: string;
  mitreId: string;
  payloadPreview?: string;
  hexDump?: string[];
  signatureMatch: string;
  confidence: number;
  affectedAssetsCount: number;
  associatedCaseId?: string;
  jurisdiction?: string;
  certInNoticeIssued?: boolean;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  threatLevel: ThreatLevel;
  actor?: string;
  sourceIp?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'PCAP' | 'MEMORY_DUMP' | 'LOG_EXTRACT' | 'CRYPTO_TX' | 'SCREENSHOT' | 'MALWARE_SAMPLE' | 'UPI_STATEMENT' | 'CDR_TDR_LOG';
  hash: string;
  fileSize: string;
  collectedAt: string;
  collectedBy: string;
  verified: boolean;
}

export interface Investigation {
  id: string;
  caseCode: string;
  title: string;
  summary: string;
  priority: 'P1 - CRITICAL' | 'P2 - HIGH' | 'P3 - MEDIUM' | 'P4 - LOW';
  status: 'TRIAGE' | 'ACTIVE_INVESTIGATION' | 'CONTAINMENT' | 'ESCALATED_LE' | 'CLOSED';
  leadAnalyst: string;
  investigatingAgency: string; // e.g. "I4C / CBI Cyber Division", "Maharashtra Cyber", "CERT-In CNI Cell"
  threatActorGroup: string;
  attributionConfidence: number;
  threatScore: number;
  openedDate: string;
  lastUpdated: string;
  targetSectors: string[];
  financialDamageEst?: string; // e.g. "₹142.5 Crore (~$17.1M USD)"
  compromisedEndpoints: number;
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  indicatorsOfCompromise: {
    type: 'IP' | 'DOMAIN' | 'HASH' | 'WALLET' | 'UPI_VPA' | 'PHONE_IMEI';
    value: string;
    role: string;
  }[];
  caseNotes: {
    id: string;
    author: string;
    timestamp: string;
    text: string;
  }[];
  tags: string[];
}

export interface IntelligenceReport {
  id: string;
  reportCode: string;
  title: string;
  type: 'THREAT_ACTOR_DOSSIER' | 'INCIDENT_POSTMORTEM' | 'MALWARE_ANALYSIS' | 'WEEKLY_INTEL_BRIEF' | 'IOC_BULLETIN';
  classification: 'TOP SECRET // NTRO-RAW-CERT' | 'SECRET // GOVT OF INDIA' | 'RESTRICTED // I4C-SOC' | 'TLP:AMBER+STRICT // MeitY-CERT-In';
  author: string;
  date: string;
  threatLevel: ThreatLevel;
  summary: string;
  threatActor?: string;
  executiveBrief: string;
  keyFindings: string[];
  ttpList: {
    tactic: string;
    technique: string;
    id: string;
    observation: string;
  }[];
  indicators: {
    type: string;
    indicator: string;
    confidence: string;
    firstSeen: string;
  }[];
  recommendedMitigations: string[];
  readTime: string;
  downloadsCount: number;
}

export interface AIAnalysisSummary {
  headline: string;
  confidenceScore: number;
  keyObservation: string;
  primaryThreatActor: string;
  anomaliesDetected: number;
  suggestedAction: string;
  criticalNodesToIsolate: string[];
  timestamp: string;
}
