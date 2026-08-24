import React, { createContext, useContext, useState, useEffect } from 'react';
import { Entity, NetworkNode, NetworkLink, Alert, Investigation, IntelligenceReport, ThreatLevel } from '../types';
import { mockEntities } from '../data/entities';
import { mockNetworkNodes, mockNetworkLinks } from '../data/network';
import { mockAlerts } from '../data/alerts';
import { mockInvestigations } from '../data/investigations';
import { mockReports } from '../data/reports';
import { playCyberSound, toggleSound as toggleSoundUtil, isSoundEnabled } from '../utils/audio';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
}

interface IntelligenceContextType {
  // Data
  entities: Entity[];
  networkNodes: NetworkNode[];
  networkLinks: NetworkLink[];
  alerts: Alert[];
  investigations: Investigation[];
  reports: IntelligenceReport[];
  
  // Selected inspection objects
  selectedEntity: Entity | null;
  setSelectedEntity: (entity: Entity | null) => void;
  selectedNode: NetworkNode | null;
  setSelectedNode: (node: NetworkNode | null) => void;
  selectedAlert: Alert | null;
  setSelectedAlert: (alert: Alert | null) => void;
  selectedInvestigation: Investigation | null;
  setSelectedInvestigation: (investigation: Investigation | null) => void;
  selectedReport: IntelligenceReport | null;
  setSelectedReport: (report: IntelligenceReport | null) => void;

  // Actions
  isolateNode: (nodeId: string) => void;
  isolateEntity: (entityId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  escalateAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  addInvestigation: (newCase: Partial<Investigation>) => void;
  addCaseNote: (caseId: string, text: string, author?: string) => void;
  addCaseEvidence: (caseId: string, evidenceTitle: string, type: 'PCAP' | 'MEMORY_DUMP' | 'LOG_EXTRACT' | 'CRYPTO_TX' | 'SCREENSHOT' | 'MALWARE_SAMPLE', hash: string) => void;
  
  // Global search modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Create case modal
  isNewCaseOpen: boolean;
  setIsNewCaseOpen: (open: boolean) => void;

  // Audio SFX
  soundActive: boolean;
  toggleSoundState: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;

  // Real-time live simulation toggle
  liveFeedActive: boolean;
  setLiveFeedActive: (active: boolean) => void;

  // Global Threat Level
  defconLevel: number; // 1 to 5 (2 = ELEVATED)
  currentRiskScore: number;
}

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

export const IntelligenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entities, setEntities] = useState<Entity[]>(mockEntities);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>(mockNetworkNodes);
  const [networkLinks, setNetworkLinks] = useState<NetworkLink[]>(mockNetworkLinks);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [investigations, setInvestigations] = useState<Investigation[]>(mockInvestigations);
  const [reports, setReports] = useState<IntelligenceReport[]>(mockReports);

  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedInvestigation, setSelectedInvestigation] = useState<Investigation | null>(null);
  const [selectedReport, setSelectedReport] = useState<IntelligenceReport | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(isSoundEnabled());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [liveFeedActive, setLiveFeedActive] = useState(true);
  const [defconLevel] = useState(2);
  const [currentRiskScore] = useState(87);

  const toggleSoundState = () => {
    const updated = toggleSoundUtil();
    setSoundActive(updated);
    if (updated) playCyberSound('blip');
  };

  const addToast = (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const newToast: ToastMessage = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString()
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    if (toast.type === 'critical') {
      playCyberSound('alert');
    } else if (toast.type === 'warning') {
      playCyberSound('blip');
    } else {
      playCyberSound('click');
    }

    setTimeout(() => {
      removeToast(newToast.id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const isolateNode = (nodeId: string) => {
    setNetworkNodes(prev =>
      prev.map(node =>
        node.id === nodeId ? { ...node, status: 'ISOLATED', threatLevel: 'CRITICAL' } : node
      )
    );
    playCyberSound('lock');
    addToast({
      title: 'NODE PERIMETER ISOLATED',
      message: `Node ${nodeId} network interface quarantined via automated SDN rule.`,
      type: 'critical'
    });
  };

  const isolateEntity = (entityId: string) => {
    setEntities(prev =>
      prev.map(e =>
        e.id === entityId ? { ...e, status: 'ISOLATED' } : e
      )
    );
    playCyberSound('lock');
    addToast({
      title: 'ENTITY ISOLATED',
      message: `Entity ID ${entityId} placed in strict SOC quarantine.`,
      type: 'warning'
    });
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a
      )
    );
    playCyberSound('click');
    addToast({
      title: 'ALERT ACKNOWLEDGED',
      message: `Alert ${alertId} assigned to primary analyst queue.`,
      type: 'info'
    });
  };

  const escalateAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId ? { ...a, status: 'ESCALATED' } : a
      )
    );
    playCyberSound('alert');
    addToast({
      title: 'ALERT ESCALATED TO INCIDENT',
      message: `Alert ${alertId} escalated to Priority-1 Incident response.`,
      type: 'critical'
    });
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId ? { ...a, status: 'RESOLVED' } : a
      )
    );
    playCyberSound('success');
    addToast({
      title: 'ALERT RESOLVED',
      message: `Threat indicator on ${alertId} marked neutralized.`,
      type: 'success'
    });
  };

  const addInvestigation = (newCase: Partial<Investigation>) => {
    const caseId = `CASE-2026-${String(investigations.length + 42).padStart(3, '0')}`;
    const fullCase: Investigation = {
      id: caseId,
      caseCode: newCase.caseCode || `OP-CYBER-${Date.now().toString().slice(-4)}`,
      title: newCase.title || 'Untitled Threat Investigation',
      summary: newCase.summary || 'New cyber intelligence case file opened by analyst.',
      priority: newCase.priority || 'P2 - HIGH',
      status: 'ACTIVE_INVESTIGATION',
      leadAnalyst: newCase.leadAnalyst || 'Senior Threat Intel Lead (Analyst #884)',
      investigatingAgency: newCase.investigatingAgency || 'CERT-In / Indian Cyber Crime Coordination Centre',
      threatActorGroup: newCase.threatActorGroup || 'Unknown Adversary',
      attributionConfidence: newCase.attributionConfidence || 75,
      threatScore: newCase.threatScore || 85,
      openedDate: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      lastUpdated: 'Just now',
      targetSectors: newCase.targetSectors || ['Enterprise'],
      financialDamageEst: newCase.financialDamageEst || 'Assessing...',
      compromisedEndpoints: newCase.compromisedEndpoints || 1,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
          title: 'Case File Initialized',
          description: 'Automated intelligence correlation triggered initial case creation.',
          threatLevel: (newCase.priority?.includes('P1') ? 'CRITICAL' : 'HIGH') as ThreatLevel
        }
      ],
      evidence: [],
      indicatorsOfCompromise: newCase.indicatorsOfCompromise || [],
      caseNotes: [
        {
          id: `note-${Date.now()}`,
          author: 'Senior Threat Intel Lead',
          timestamp: 'Just now',
          text: 'Case initialized for forensic analysis and containment monitoring.'
        }
      ],
      tags: newCase.tags || ['New Case', 'Cybercrime']
    };

    setInvestigations(prev => [fullCase, ...prev]);
    playCyberSound('success');
    addToast({
      title: 'NEW INVESTIGATION OPENED',
      message: `Case ${fullCase.id}: "${fullCase.title}" initialized successfully.`,
      type: 'success'
    });
  };

  const addCaseNote = (caseId: string, text: string, author = 'Senior Threat Intel Lead') => {
    setInvestigations(prev =>
      prev.map(inv => {
        if (inv.id === caseId) {
          const newNote = {
            id: `note-${Date.now()}`,
            author,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
            text
          };
          return {
            ...inv,
            lastUpdated: 'Just now',
            caseNotes: [newNote, ...inv.caseNotes]
          };
        }
        return inv;
      })
    );
    playCyberSound('click');
    addToast({
      title: 'NOTE RECORDED',
      message: `Forensic analyst note added to case ${caseId}.`,
      type: 'info'
    });
  };

  const addCaseEvidence = (
    caseId: string,
    evidenceTitle: string,
    type: 'PCAP' | 'MEMORY_DUMP' | 'LOG_EXTRACT' | 'CRYPTO_TX' | 'SCREENSHOT' | 'MALWARE_SAMPLE',
    hash: string
  ) => {
    setInvestigations(prev =>
      prev.map(inv => {
        if (inv.id === caseId) {
          const newEvidence = {
            id: `ev-${Date.now().toString().slice(-4)}`,
            title: evidenceTitle,
            type,
            hash,
            fileSize: `${(Math.random() * 50 + 1).toFixed(1)} MB`,
            collectedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
            collectedBy: 'Forensic Triage Suite',
            verified: true
          };
          return {
            ...inv,
            lastUpdated: 'Just now',
            evidence: [newEvidence, ...inv.evidence]
          };
        }
        return inv;
      })
    );
    playCyberSound('success');
    addToast({
      title: 'EVIDENCE LOGGED',
      message: `Artifact "${evidenceTitle}" verified and hashed into case vault.`,
      type: 'success'
    });
  };

  // Keyboard shortcut listener for Global Search (press '/' or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        playCyberSound('blip');
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNewCaseOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <IntelligenceContext.Provider
      value={{
        entities,
        networkNodes,
        networkLinks,
        alerts,
        investigations,
        reports,
        selectedEntity,
        setSelectedEntity,
        selectedNode,
        setSelectedNode,
        selectedAlert,
        setSelectedAlert,
        selectedInvestigation,
        setSelectedInvestigation,
        selectedReport,
        setSelectedReport,
        isolateNode,
        isolateEntity,
        acknowledgeAlert,
        escalateAlert,
        resolveAlert,
        addInvestigation,
        addCaseNote,
        addCaseEvidence,
        isSearchOpen,
        setIsSearchOpen,
        isNewCaseOpen,
        setIsNewCaseOpen,
        soundActive,
        toggleSoundState,
        toasts,
        addToast,
        removeToast,
        liveFeedActive,
        setLiveFeedActive,
        defconLevel,
        currentRiskScore
      }}
    >
      {children}
    </IntelligenceContext.Provider>
  );
};

export const useIntelligence = () => {
  const context = useContext(IntelligenceContext);
  if (!context) {
    throw new Error('useIntelligence must be used within an IntelligenceProvider');
  }
  return context;
};
