import { Investigation } from '../types';

export const mockInvestigations: Investigation[] = [
  {
    id: 'CASE-IND-2026-088',
    caseCode: 'OP-CHAKRA-IV',
    title: 'Operation Chakra-IV: Transnational Mule Account & Illegal Loan App Extortion Syndicate',
    summary: 'Joint nationwide operation coordinated by CBI Cyber Crime Division and I4C dismantling a syndicated network of 140+ Jan Dhan mule bank accounts laundering ₹142.5 Crore into Southeast Asian crypto off-ramps.',
    priority: 'P1 - CRITICAL',
    status: 'ACTIVE_INVESTIGATION',
    leadAnalyst: 'SP Rajeshwar K. Sharma, IPS (Superintendent of Police, Cyber Crime Operations)',
    investigatingAgency: 'CBI Cyber Crime Division & I4C (Ministry of Home Affairs)',
    threatActorGroup: 'Mewat-Southeast Asia Cyber Cartel',
    attributionConfidence: 96,
    threatScore: 98,
    openedDate: '2026-08-10 09:30:00 IST',
    lastUpdated: '15 mins ago',
    targetSectors: ['Banking & UPI', 'NBFC Lending', 'Telecommunications', 'Senior Citizens'],
    financialDamageEst: '₹142.5 Crore (~$17.1M USD) Drained',
    compromisedEndpoints: 88,
    tags: ['CBI', 'I4C', 'UPI Mule', 'Loan App', 'Digital Arrest', 'TRON USDT', 'Operation Chakra'],
    timeline: [
      {
        id: 'tl-101',
        timestamp: '2026-08-10 09:30 IST',
        title: 'I4C National Cybercrime Reporting Portal (1930) Alert Surge',
        description: 'Over 1,200 emergency freeze requests registered within 48 hours for spoofed "Digital Arrest" calls impersonating CBI & Supreme Court judges.',
        threatLevel: 'CRITICAL',
        sourceIp: '103.145.13.88'
      },
      {
        id: 'tl-102',
        timestamp: '2026-08-14 14:15 IST',
        title: 'Mule Account Aggregation Network Uncovered',
        description: 'NPCI switch telemetry identified 140 mule current accounts across Delhi NCR, Mewat, and Ahmedabad transferring funds to P2P crypto dealers.',
        threatLevel: 'CRITICAL'
      },
      {
        id: 'tl-103',
        timestamp: '2026-08-19 22:00 IST',
        title: 'DoT Sanchar Saathi & TAFCOP Raids in Nuh & Bharatpur',
        description: 'Raids seized 384 SIM box gateways and 4,200 forged Aadhaar KYC pre-activated SIM cards used for VoIP spoofing.',
        threatLevel: 'HIGH'
      },
      {
        id: 'tl-104',
        timestamp: '2026-08-24 16:40 IST',
        title: 'TRON Ledger Freezing Coordination with FIU-IND & Interpol',
        description: 'Blue Notices issued to freeze $12.4M USDT across Binance and OKX accounts held by Myanmar/Cambodia compound operators.',
        threatLevel: 'CRITICAL'
      }
    ],
    evidence: [
      {
        id: 'ev-201',
        title: 'NPCI UPI Fast-Layering Transaction Graph (.json)',
        type: 'UPI_STATEMENT',
        hash: 'b8910acbfa718293ba91823901bca81927391ab29018293ba9124018f7a9124e',
        fileSize: '42.8 MB',
        collectedAt: '2026-08-24 16:00 IST',
        collectedBy: 'NPCI Cyber Fraud Intelligence Cell',
        verified: true
      },
      {
        id: 'ev-202',
        title: 'Seized SIM Box Call Detail Records & IMEI Logs',
        type: 'CDR_TDR_LOG',
        hash: '5d891bca72e01824cbf82194ad8172901a87bca621948ba912e87cf918a24890',
        fileSize: '840 MB',
        collectedAt: '2026-08-20 09:10 IST',
        collectedBy: 'Department of Telecommunications (DoT) & Haryana Police',
        verified: true
      },
      {
        id: 'ev-203',
        title: 'Decompiled Fake Income Tax & Loan App APKs',
        type: 'MALWARE_SAMPLE',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        fileSize: '14.2 MB',
        collectedAt: '2026-08-15 11:00 IST',
        collectedBy: 'National Cyber Forensic Laboratory (NCFL), New Delhi',
        verified: true
      }
    ],
    indicatorsOfCompromise: [
      { type: 'UPI_VPA', value: 'refund-verify.9818293847@paytm', role: 'Primary Layering Mule VPA' },
      { type: 'DOMAIN', value: 'incometaxindia-e-filing-refund.top', role: 'Credential & NetBanking Phishing Portal' },
      { type: 'WALLET', value: 'TRX7u9aK8bNm02Pq91Lk48Mv73wQz90Rt2Xp41a', role: 'Designated USDT TRC20 Laundering Pool' },
      { type: 'PHONE_IMEI', value: 'IMEI-CLUSTER-869201048821900..869201048822284', role: '384 Illegal Mewat SIM Box Farm' }
    ],
    caseNotes: [
      {
        id: 'note-101',
        author: 'SP Rajeshwar K. Sharma, IPS',
        timestamp: '2026-08-24 17:15 IST',
        text: 'Coordinated with 14 commercial banks under the 1930 Citizen Financial Cyber Fraud Reporting System. ₹18.2 Crore frozen in mid-transit before withdrawal.'
      },
      {
        id: 'note-102',
        author: 'Technical Officer Ananya Deshmukh (CERT-In / I4C)',
        timestamp: '2026-08-24 16:30 IST',
        text: 'Automated reverse DNS takedown served to international registrar for 8 CBDT/SBI spoof domains.'
      }
    ]
  },
  {
    id: 'CASE-IND-2026-079',
    caseCode: 'OP-BHARATSHIELD',
    title: 'Operation BharatShield: AIIMS & Healthcare Critical Infrastructure Ransomware Defense',
    summary: 'Forensic incident response and proactive perimeter hardening following targeted double-extortion ransomware deployment attempts against major tertiary hospital EHR clusters.',
    priority: 'P1 - CRITICAL',
    status: 'CONTAINMENT',
    leadAnalyst: 'Dr. Vikram Malhotra (Senior Technical Director, NCIIPC / CERT-In)',
    investigatingAgency: 'NCIIPC & Delhi Police Special Cell (IFSO)',
    threatActorGroup: 'DarkHydra / Ransomware Syndicate',
    attributionConfidence: 93,
    threatScore: 94,
    openedDate: '2026-08-18 04:12:00 IST',
    lastUpdated: '40 mins ago',
    targetSectors: ['Healthcare', 'National Knowledge Network (NKN)', 'EHR Databases'],
    financialDamageEst: 'Extortion Demand Rejected / Zero Patient Telemetry Leaked',
    compromisedEndpoints: 24,
    tags: ['AIIMS', 'NCIIPC', 'CERT-In', 'Ransomware', 'EHR', 'NIC', 'Healthcare'],
    timeline: [
      {
        id: 'tl-111',
        timestamp: '2026-08-18 04:12 IST',
        title: 'Exploit on Edge VPN Gateway 103.224.182.49',
        description: 'Adversary attempted credential replay on Fortinet VPN endpoint connected to National Knowledge Network.',
        threatLevel: 'CRITICAL',
        sourceIp: '103.224.182.49'
      },
      {
        id: 'tl-112',
        timestamp: '2026-08-18 05:00 IST',
        title: 'Air-Gapped Subnet Isolation Executed within 18 Minutes',
        description: 'Critical patient life support networks and OT infrastructure automatically partitioned by SOC rules.',
        threatLevel: 'HIGH'
      }
    ],
    evidence: [
      {
        id: 'ev-211',
        title: 'Memory Dump: lsass.exe & EDR Bypass Driver Logs',
        type: 'MEMORY_DUMP',
        hash: 'ca7819024bda890124781290bbfa789124018293ba91823901bca81927391ab2',
        fileSize: '1.2 GB',
        collectedAt: '2026-08-18 06:00 IST',
        collectedBy: 'CERT-In Incident Response Team',
        verified: true
      }
    ],
    indicatorsOfCompromise: [
      { type: 'IP', value: '103.224.182.49', role: 'Compromised Edge Perimeter Gateway' },
      { type: 'IP', value: '185.220.101.5', role: 'External Ransomware Command Server' },
      { type: 'HASH', value: '8f7a912b4e8910acbfa718293ba91823901bca81927391ab29018293ba912401', role: 'Ransomware Stager SHA-256' }
    ],
    caseNotes: [
      {
        id: 'note-111',
        author: 'Dr. Vikram Malhotra',
        timestamp: '2026-08-24 15:00 IST',
        text: 'All 4,800 hospital endpoints scanned and re-imaged with hardened NIC baseline. Backup restored successfully with zero data loss.'
      }
    ]
  },
  {
    id: 'CASE-IND-2026-074',
    caseCode: 'OP-MEGHDOOT',
    title: 'Operation Meghdoot: APT36 Espionage Targeting Defence & Aerospace Contractors',
    summary: 'Targeted spear-phishing and WhatsApp honey-trap campaign by Transparent Tribe (APT36) delivering weaponized Android CapraRAT malware to exfiltrate defense schematics.',
    priority: 'P1 - CRITICAL',
    status: 'ACTIVE_INVESTIGATION',
    leadAnalyst: 'Col. Amitav Sen (Joint Cyber Security Officer, Defence Cyber Agency - DCA)',
    investigatingAgency: 'Defence Cyber Agency (DCA) & CERT-In',
    threatActorGroup: 'Transparent Tribe (APT36)',
    attributionConfidence: 98,
    threatScore: 96,
    openedDate: '2026-07-25 10:00:00 IST',
    lastUpdated: '1 hour ago',
    targetSectors: ['Defence Contractors', 'DRDO', 'Indian Air Force Telemetry', 'Aerospace'],
    financialDamageEst: 'National Security Sensitive // Class 1 Espionage',
    compromisedEndpoints: 14,
    tags: ['APT36', 'TransparentTribe', 'DCA', 'DRDO', 'CapraRAT', 'DefenceCyberAgency'],
    timeline: [
      {
        id: 'tl-121',
        timestamp: '2026-07-25 10:00 IST',
        title: 'Spear-Phishing Messages on Signal & WhatsApp',
        description: 'Adversary spoofed internal Armed Forces welfare portals delivering "Kavach-Auth-v3.apk".',
        threatLevel: 'CRITICAL'
      }
    ],
    evidence: [
      {
        id: 'ev-221',
        title: 'CapraRAT APK Bytecode Disassembly & C2 Telemetry',
        type: 'MALWARE_SAMPLE',
        hash: '8f7a912b4e8910acbfa718293ba91823901bca81927391ab29018293ba912401',
        fileSize: '8.4 MB',
        collectedAt: '2026-07-26 14:00 IST',
        collectedBy: 'Defence Cyber Forensics Lab (DCFL)',
        verified: true
      }
    ],
    indicatorsOfCompromise: [
      { type: 'DOMAIN', value: 'defence-kavach-auth.org', role: 'Malicious Android APK Delivery URL' },
      { type: 'IP', value: '185.220.101.5', role: 'CapraRAT C2 Listener' }
    ],
    caseNotes: [
      {
        id: 'note-121',
        author: 'Col. Amitav Sen',
        timestamp: '2026-08-24 14:00 IST',
        text: 'Advisory circular DCA/ADV/2026/18 dispatched to all Tri-Services commands. Mobile endpoint quarantine deployed.'
      }
    ]
  },
  {
    id: 'CASE-IND-2026-068',
    caseCode: 'OP-VIDYUTBREAK',
    title: 'Operation VidyutBreak: RedEcho CNI Power Grid Probing & SCADA Hardening',
    summary: 'Identification of covert ShadowPad beaconing attempting reconnaissance on Northern and Western Regional Load Despatch Centres (RLDCs) via Modbus and Siemens S7 industrial protocols.',
    priority: 'P2 - HIGH',
    status: 'CONTAINMENT',
    leadAnalyst: 'Engineer Sunita Nair (CNI Grid Protection Lead, NCIIPC)',
    investigatingAgency: 'NCIIPC & Power System Operation Corporation (POSOCO)',
    threatActorGroup: 'RedEcho / APT41 Nexus',
    attributionConfidence: 94,
    threatScore: 91,
    openedDate: '2026-06-15 08:00:00 IST',
    lastUpdated: '3 hours ago',
    targetSectors: ['Power & Energy', 'Critical Infrastructure', 'SCADA / OT'],
    financialDamageEst: 'National Grid Stability Safeguarded / Zero Disruption',
    compromisedEndpoints: 6,
    tags: ['RedEcho', 'ShadowPad', 'PowerGrid', 'NCIIPC', 'POSOCO', 'SCADA'],
    timeline: [
      {
        id: 'tl-131',
        timestamp: '2026-06-15 08:00 IST',
        title: 'Anomalous Port 502 Modbus Query Surge on Regional Grid Gateways',
        description: 'High-frequency telemetry interrogation detected from Shenzhen IP range 103.145.13.88.',
        threatLevel: 'HIGH',
        sourceIp: '103.145.13.88'
      }
    ],
    evidence: [
      {
        id: 'ev-231',
        title: 'Modbus Protocol Packet Capture (.pcap)',
        type: 'PCAP',
        hash: '901bca81927391ab29018293ba9124018f7a912b4e8910acbfa718293ba91823',
        fileSize: '410 MB',
        collectedAt: '2026-06-16 00:00 IST',
        collectedBy: 'NCIIPC Industrial OT Sentry Grid',
        verified: true
      }
    ],
    indicatorsOfCompromise: [
      { type: 'IP', value: '103.145.13.88', role: 'ShadowPad C2 Node' },
      { type: 'DOMAIN', value: 'grid-sync-telemetry.cc', role: 'Backup Exfiltration Stager' }
    ],
    caseNotes: [
      {
        id: 'note-131',
        author: 'Engineer Sunita Nair',
        timestamp: '2026-08-24 11:30 IST',
        text: 'All substation programmable logic controllers (PLCs) isolated behind hardware unidirectional data diodes.'
      }
    ]
  }
];
