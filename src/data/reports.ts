import { IntelligenceReport } from '../types';

export const mockReports: IntelligenceReport[] = [
  {
    id: 'REP-IND-2026-092',
    reportCode: 'CERT-IN-DOSSIER-MULE-CHAKRA',
    title: 'Adversary Threat Profile: Transnational Cyber Slavery & Mule Account Banking Rings (Operation Chakra-IV)',
    type: 'THREAT_ACTOR_DOSSIER',
    classification: 'SECRET // GOVT OF INDIA',
    author: 'I4C Cyber Threat Intelligence Unit & CBI Cyber Crime Division',
    date: '2026-08-24',
    threatLevel: 'CRITICAL',
    threatActor: 'Mewat-Southeast Asia Cyber Cartel',
    summary: 'Technical and financial forensic teardown of automated UPI rapid-layering protocols, Jamtara/Mewat SIM box operations, and P2P USDT cryptocurrency off-ramping into Cambodian/Myanmar compounds.',
    executiveBrief: 'Syndicated crime groups have industrialized the recruitment of vulnerable Indian citizens into Southeast Asian cyber-fraud compounds. Drained funds from "Digital Arrest", illegal loan apps, and part-time job scams are routed through pre-activated Jan Dhan and corporate mule bank accounts via automated UPI batch scripts within 180 seconds before conversion to USDT on decentralized bridges.',
    keyFindings: [
      'Over ₹142.5 Crore ($17.1M USD) drained across 14,000 victim complaints registered on I4C Portal (1930) in Q2 2026.',
      'Identified automated switching network linking 140 mule VPAs with rapid micro-transfers of ₹49,999 to bypass bank velocity triggers.',
      'Raid on illegal SIM Box farms in Mewat seized 384 gateway devices utilizing counterfeit Aadhaar e-KYC documents.',
      'P2P crypto off-ramping accounts identified on TRON network and submitted for Interpol Blue Notice action.'
    ],
    ttpList: [
      {
        tactic: 'Initial Access',
        technique: 'Phishing: Voice Phishing (Vishing) & Digital Arrest',
        id: 'T1566.004',
        observation: 'VoIP caller-ID spoofing impersonating CBI Officers, TRAI officials, and Supreme Court registries.'
      },
      {
        tactic: 'Collection',
        technique: 'Automated SMS / OTP Interception via Malware',
        id: 'T1114.002',
        observation: 'Malicious Android APKs intercepting banking OTPs and forwarding via Telegram bot APIs.'
      },
      {
        tactic: 'Impact',
        technique: 'Financial Theft: Automated Payment Switching (UPI)',
        id: 'T1657',
        observation: 'Fast-layering across Jan Dhan mule networks to drain balances in under 3 minutes.'
      }
    ],
    indicators: [
      { type: 'UPI VPA', indicator: 'refund-verify.9818293847@paytm', confidence: '99% (High)', firstSeen: '2026-07-10' },
      { type: 'Domain', indicator: 'incometaxindia-e-filing-refund.top', confidence: '98% (High)', firstSeen: '2026-08-01' },
      { type: 'TRC-20 Wallet', indicator: 'TRX7u9aK8bNm02Pq91Lk48Mv73wQz90Rt2Xp41a', confidence: '99% (High)', firstSeen: '2026-05-19' },
      { type: 'APK SHA-256', indicator: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', confidence: '97% (High)', firstSeen: '2026-08-15' }
    ],
    recommendedMitigations: [
      'Enforce NPCI real-time risk-based authentication triggers for consecutive ₹49,999 payments from new VPAs.',
      'Telecom Service Providers (TSPs) must cross-reference SIM activation GPS coordinates with DoT TAFCOP fraud database.',
      'Mandatory implementation of RBI Continuous Transaction Monitoring System (CTMS) across all cooperative and scheduled banks.',
      'Immediate blocking of identified IP ranges and TRC-20 wallet addresses across Indian FIU-registered crypto exchanges.'
    ],
    readTime: '12 min read',
    downloadsCount: 420
  },
  {
    id: 'REP-IND-2026-090',
    reportCode: 'NCIIPC-ADVISORY-CNI-GRID',
    title: 'Critical National Infrastructure Advisory: RedEcho / ShadowPad Probing on Regional Power Grids',
    type: 'INCIDENT_POSTMORTEM',
    classification: 'TOP SECRET // NTRO-RAW-CERT',
    author: 'NCIIPC & National Technical Research Organisation (NTRO)',
    date: '2026-08-22',
    threatLevel: 'CRITICAL',
    threatActor: 'RedEcho / APT41 Nexus',
    summary: 'Technical teardown of ShadowPad payload persistence and Modbus SCADA command probing targeting Northern Regional Load Despatch Centre (NRLDC) substations.',
    executiveBrief: 'State-sponsored threat group RedEcho conducted active port 502 Modbus scanning and Siemens S7 PLC interrogation against electrical distribution gateways. All critical command paths were thwarted by hardware unidirectional data diodes deployed under NCIIPC guidelines.',
    keyFindings: [
      'Command and control server located at Shenzhen IP 103.145.13.88.',
      'Targeted Modbus holding registers 40001-40050 containing grid load balancing telemetry.',
      'Zero disruption to national electrical frequency or grid operations.'
    ],
    ttpList: [
      {
        tactic: 'Discovery',
        technique: 'Network Service Discovery: Modbus SCADA',
        id: 'T0840',
        observation: 'Automated polling of PLC telemetry registers over TCP port 502.'
      },
      {
        tactic: 'Command and Control',
        technique: 'ShadowPad Malleable C2 Protocol',
        id: 'T1071.001',
        observation: 'Encrypted heartbeat beacons over port 8443 disguised as SSL web traffic.'
      }
    ],
    indicators: [
      { type: 'IP', indicator: '103.145.13.88', confidence: '99% (High)', firstSeen: '2026-06-12' },
      { type: 'Domain', indicator: 'grid-sync-telemetry.cc', confidence: '94% (High)', firstSeen: '2026-06-15' }
    ],
    recommendedMitigations: [
      'Maintain strict physical air-gapping and hardware data diodes between OT SCADA and IT enterprise subnets.',
      'Disable remote web management on all substation perimeter RTUs.',
      'Ingest NCIIPC indicators into power utility SIEMs.'
    ],
    readTime: '9 min read',
    downloadsCount: 280
  },
  {
    id: 'REP-IND-2026-087',
    reportCode: 'CERT-IN-ANNUAL-LANDSCAPE',
    title: 'National Cyber Security Landscape & CERT-In Mandatory Reporting Directive Compliance Report (Q2-2026)',
    type: 'WEEKLY_INTEL_BRIEF',
    classification: 'TLP:AMBER+STRICT // MeitY-CERT-In',
    author: 'Indian Computer Emergency Response Team (CERT-In)',
    date: '2026-08-20',
    threatLevel: 'MEDIUM',
    summary: 'Quarterly review of 6-hour mandatory cyber incident reporting compliance, government website defacements, ransomware containment in health/banking sectors, and citizen protection metrics under Citizen Financial Cyber Fraud Reporting System 1930.',
    executiveBrief: 'During Q2 2026, CERT-In handled 384,000 security incidents, prevented ₹380 Crore in fraudulent bank transfers in coordination with I4C, and issued 18 critical zero-day advisories for Indian enterprise software ecosystems.',
    keyFindings: [
      '94.2% compliance rate with CERT-In 6-hour mandatory cyber incident reporting rule.',
      'Citizens saved ₹380 Crore through immediate 1930 hotline bank freezing intervention.',
      'Active nationwide threat posture maintained at ELEVATED DEFCON 2.'
    ],
    ttpList: [
      {
        tactic: 'Initial Access',
        technique: 'Phishing & Smishing',
        id: 'T1566',
        observation: 'Surge in fake Income Tax, SBI Yono, and EPFO claim portals.'
      }
    ],
    indicators: [
      { type: 'Domain', indicator: 'sbi-yono-kyc-verification.live', confidence: '96% (High)', firstSeen: '2026-08-10' },
      { type: 'IP', indicator: '103.224.182.49', confidence: '90% (High)', firstSeen: '2026-07-28' }
    ],
    recommendedMitigations: [
      'Ensure all system logs are retained securely within Indian jurisdiction for 180 days as mandated by CERT-In directions.',
      'Deploy multi-factor authentication (MFA) across all government and enterprise cloud tenants.'
    ],
    readTime: '15 min read',
    downloadsCount: 590
  }
];
