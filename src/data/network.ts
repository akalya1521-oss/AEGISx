import { NetworkNode, NetworkLink } from '../types';

export const mockNetworkNodes: NetworkNode[] = [
  // Cluster 1: RedEcho CNI Power Grid Cyber Attack (Top-Left)
  {
    id: 'node-redecho-c2',
    label: 'RedEcho / APT41 C2 (103.145.13.88)',
    type: 'BOTNET_C2',
    threatLevel: 'CRITICAL',
    threatScore: 98,
    cluster: 'RedEcho CNI Grid Target',
    ip: '103.145.13.88',
    asn: 'AS4134 Chinanet',
    country: 'China',
    trafficRate: '8.4 MB/s',
    beaconInterval: '15s',
    isC2: true,
    status: 'ACTIVE',
    x: 280,
    y: 180,
    details: 'Primary Command and Control nexus orchestrating ShadowPad beacons against Indian Power Grid.'
  },
  {
    id: 'node-nrldc-substation',
    label: 'NRLDC Substation SCADA Gateway (10.12.88.4)',
    type: 'IP',
    threatLevel: 'CRITICAL',
    threatScore: 92,
    cluster: 'RedEcho CNI Grid Target',
    ip: '10.12.88.4',
    state: 'Punjab / Haryana Grid',
    country: 'India',
    trafficRate: '1.2 MB/s',
    beaconInterval: 'Realtime',
    status: 'ACTIVE',
    x: 360,
    y: 260,
    details: 'Modbus TCP Port 502 gateway receiving telemetry interrogation requests.'
  },
  {
    id: 'node-posoco-core',
    label: 'POSOCO National Grid Controller',
    type: 'IP',
    threatLevel: 'HIGH',
    threatScore: 88,
    cluster: 'RedEcho CNI Grid Target',
    ip: '10.0.12.1',
    state: 'New Delhi',
    country: 'India',
    trafficRate: '4.8 MB/s',
    status: 'TARGET',
    x: 460,
    y: 200,
    details: 'National Load Despatch Centre core telemetry cluster protected by unidirectional data diodes.'
  },

  // Cluster 2: Mewat-Jamtara Transnational UPI & Crypto Fraud Ring (Center-Right)
  {
    id: 'node-mewat-vpa',
    label: 'Jamtara UPI Mule Hub (refund-verify...paytm)',
    type: 'UPI_VPA',
    threatLevel: 'CRITICAL',
    threatScore: 99,
    cluster: 'Operation Chakra Mule Ring',
    state: 'Jharkhand',
    country: 'India',
    trafficRate: '1,420 Tx/min',
    status: 'ACTIVE',
    x: 640,
    y: 240,
    details: 'Layering hub routing ₹49,999 batch payments from pig-butchering and digital arrest victims.'
  },
  {
    id: 'node-mewat-simbox',
    label: 'Mewat SIM Box Farm (384 IMEIs)',
    type: 'SIM_BOX_IMEI',
    threatLevel: 'HIGH',
    threatScore: 86,
    cluster: 'Operation Chakra Mule Ring',
    state: 'Haryana',
    country: 'India',
    trafficRate: '80 Calls/sec',
    status: 'ISOLATED',
    x: 560,
    y: 340,
    details: 'Hardware SIM box array spoofing CBI/Police caller ID to execute digital arrest extortion.'
  },
  {
    id: 'node-tron-usdt',
    label: 'TRON USDT P2P Launderer (TRX7u9a...)',
    type: 'CRYPTO_WALLET',
    threatLevel: 'CRITICAL',
    threatScore: 99,
    cluster: 'Operation Chakra Mule Ring',
    country: 'Myanmar (Cyber Compound)',
    trafficRate: '45,000 USDT/hr',
    status: 'ACTIVE',
    x: 740,
    y: 180,
    details: 'Designated crypto cashout pool off-ramping INR funds into offshore USDT tokens.'
  },
  {
    id: 'node-tax-phish',
    label: 'incometaxindia-e-filing-refund.top',
    type: 'DOMAIN',
    threatLevel: 'CRITICAL',
    threatScore: 96,
    cluster: 'Operation Chakra Mule Ring',
    ip: '193.106.191.244',
    country: 'Cambodia',
    trafficRate: '6.2 MB/s',
    status: 'ACTIVE',
    x: 780,
    y: 300,
    details: 'Adversary-in-the-Middle reverse proxy capturing NetBanking credentials and Aadhaar OTPs.'
  },

  // Cluster 3: Transparent Tribe (APT36) Defence Espionage (Bottom-Left)
  {
    id: 'node-apt36-c2',
    label: 'APT36 Rawalpindi C2 (185.220.101.5)',
    type: 'THREAT_ACTOR',
    threatLevel: 'CRITICAL',
    threatScore: 97,
    cluster: 'Transparent Tribe (APT36)',
    ip: '185.220.101.5',
    country: 'Pakistan',
    trafficRate: '2.4 MB/s',
    status: 'ACTIVE',
    x: 240,
    y: 440,
    details: 'CapraRAT Android Trojan master controller targeting Indian defence personnel.'
  },
  {
    id: 'node-drdo-contractor',
    label: 'DRDO Vendor Endpoint (Kavach-Auth.apk)',
    type: 'FILE_HASH',
    threatLevel: 'HIGH',
    threatScore: 94,
    cluster: 'Transparent Tribe (APT36)',
    state: 'Bengaluru / Hyderabad',
    country: 'India',
    trafficRate: '540 KB/s',
    status: 'ACTIVE',
    x: 360,
    y: 460,
    details: 'Infected mobile device streaming ambient audio and WhatsApp chat database.'
  },

  // Cluster 4: AIIMS Healthcare EHR Network Security (Bottom-Right)
  {
    id: 'node-aiims-edge',
    label: 'AIIMS Delhi Edge Gateway (103.224.182.49)',
    type: 'IP',
    threatLevel: 'HIGH',
    threatScore: 86,
    cluster: 'AIIMS Healthcare Sentry',
    ip: '103.224.182.49',
    state: 'Delhi NCR',
    country: 'India',
    trafficRate: '18.4 MB/s',
    status: 'ISOLATED',
    x: 620,
    y: 480,
    details: 'Perimeter VPN gateway isolated after detecting anomalous administrative session replay.'
  },
  {
    id: 'node-aiims-ehr',
    label: 'AIIMS Central EHR Patient Database',
    type: 'IP',
    threatLevel: 'HIGH',
    threatScore: 82,
    cluster: 'AIIMS Healthcare Sentry',
    ip: '10.0.4.1',
    state: 'Delhi NCR',
    country: 'India',
    trafficRate: '32.1 MB/s',
    status: 'TARGET',
    x: 740,
    y: 460,
    details: 'National Health Authority (ABDM) integrated electronic health record database.'
  },

  // Core Target: NPCI National UPI Payment Switch (Center Core)
  {
    id: 'node-npci-switch',
    label: 'NPCI National UPI Payment Switch',
    type: 'IP',
    threatLevel: 'CRITICAL',
    threatScore: 99,
    cluster: 'Target Infrastructure',
    ip: '192.168.1.1',
    state: 'Mumbai (Core Financial Zone)',
    country: 'India',
    trafficRate: '68.4 MB/s',
    status: 'TARGET',
    x: 480,
    y: 330,
    details: 'National settlement backbone processing 400M+ daily digital transactions across India.'
  }
];

export const mockNetworkLinks: NetworkLink[] = [
  // RedEcho links
  {
    source: 'node-redecho-c2',
    target: 'node-nrldc-substation',
    type: 'C2_BEACON',
    threatLevel: 'CRITICAL',
    bandwidth: '8.4 MB/s',
    packetCount: 184900,
    active: true,
    protocol: 'SCADA/Modbus',
    lastActivity: '4s ago'
  },
  {
    source: 'node-nrldc-substation',
    target: 'node-posoco-core',
    type: 'LATERAL_MOVEMENT',
    threatLevel: 'CRITICAL',
    bandwidth: '1.2 MB/s',
    packetCount: 42100,
    active: true,
    protocol: 'TCP/443',
    lastActivity: '12s ago'
  },

  // Operation Chakra UPI Mule links
  {
    source: 'node-tax-phish',
    target: 'node-mewat-vpa',
    type: 'UPI_FRAUD_BURST',
    threatLevel: 'CRITICAL',
    bandwidth: '6.2 MB/s',
    packetCount: 94100,
    active: true,
    protocol: 'UPI/ISO8583',
    lastActivity: 'Just now'
  },
  {
    source: 'node-mewat-simbox',
    target: 'node-mewat-vpa',
    type: 'UPI_FRAUD_BURST',
    threatLevel: 'CRITICAL',
    bandwidth: '1.4 MB/s',
    packetCount: 58200,
    active: true,
    protocol: 'HTTPS',
    lastActivity: '18s ago'
  },
  {
    source: 'node-mewat-vpa',
    target: 'node-tron-usdt',
    type: 'CRYPTO_TRANSFER',
    threatLevel: 'CRITICAL',
    bandwidth: '18.4 MB/s',
    packetCount: 14200,
    active: true,
    protocol: 'HTTPS',
    lastActivity: '2 mins ago'
  },
  {
    source: 'node-mewat-vpa',
    target: 'node-npci-switch',
    type: 'UPI_FRAUD_BURST',
    threatLevel: 'CRITICAL',
    bandwidth: '12.8 MB/s',
    packetCount: 88400,
    active: true,
    protocol: 'UPI/ISO8583',
    lastActivity: 'Just now'
  },

  // APT36 links
  {
    source: 'node-apt36-c2',
    target: 'node-drdo-contractor',
    type: 'C2_BEACON',
    threatLevel: 'CRITICAL',
    bandwidth: '2.4 MB/s',
    packetCount: 31000,
    active: true,
    protocol: 'CUSTOM_ENC',
    lastActivity: '8s ago'
  },
  {
    source: 'node-drdo-contractor',
    target: 'node-posoco-core',
    type: 'LATERAL_MOVEMENT',
    threatLevel: 'HIGH',
    bandwidth: '540 KB/s',
    packetCount: 8900,
    active: true,
    protocol: 'SSH/22',
    lastActivity: '25 mins ago'
  },

  // AIIMS links
  {
    source: 'node-aiims-edge',
    target: 'node-aiims-ehr',
    type: 'LATERAL_MOVEMENT',
    threatLevel: 'HIGH',
    bandwidth: '18.4 MB/s',
    packetCount: 45000,
    active: false,
    protocol: 'TCP/443',
    lastActivity: 'Isolated'
  }
];

export const networkClusters = [
  { id: 'all', name: 'All National Threat Clusters', count: 11, color: '#00f0ff' },
  { id: 'Operation Chakra Mule Ring', name: 'Op Chakra Mule & Crypto Ring', count: 4, color: '#ff3b5c' },
  { id: 'RedEcho CNI Grid Target', name: 'RedEcho CNI Power Grid', count: 3, color: '#ff9900' },
  { id: 'Transparent Tribe (APT36)', name: 'APT36 Defence Espionage', count: 2, color: '#a855f7' },
  { id: 'AIIMS Healthcare Sentry', name: 'AIIMS Health Network Sentry', count: 2, color: '#00e676' },
  { id: 'Target Infrastructure', name: 'National UPI / CNI Core', count: 1, color: '#38bdf8' }
];
