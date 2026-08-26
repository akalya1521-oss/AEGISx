import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export interface Toast {
  id?: string;
  title: string;
  message: string;
  type: "success" | "warning" | "critical" | "info";
}

export interface IntelligenceItem {
  id: string;
  title: string;
  description?: string;
  type?: string;
  severity?: string;
  timestamp?: string;
}

export interface Entity {
  id: string;
  name: string;
  type?: string;
  category?: string;
  severity?: string;
  status?: string;
}

export interface NetworkItem {
  id: string;
  source?: string;
  target?: string;
  type?: string;
  label?: string;
  status?: string;
}

interface IntelligenceContextType {
  currentRiskScore: number;
  setCurrentRiskScore: React.Dispatch<
    React.SetStateAction<number>
  >;

  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;

  alerts: IntelligenceItem[];
  threats: IntelligenceItem[];
  investigations: IntelligenceItem[];
  events: IntelligenceItem[];

  entities: Entity[];

  networkData: NetworkItem[];

  setAlerts: React.Dispatch<
    React.SetStateAction<IntelligenceItem[]>
  >;

  setThreats: React.Dispatch<
    React.SetStateAction<IntelligenceItem[]>
  >;

  setInvestigations: React.Dispatch<
    React.SetStateAction<IntelligenceItem[]>
  >;

  setEvents: React.Dispatch<
    React.SetStateAction<IntelligenceItem[]>
  >;

  setEntities: React.Dispatch<
    React.SetStateAction<Entity[]>
  >;

  setNetworkData: React.Dispatch<
    React.SetStateAction<NetworkItem[]>
  >;

  soundActive: boolean;
  toggleSoundState: () => void;

  defconLevel: number;
  setDefconLevel: React.Dispatch<
    React.SetStateAction<number>
  >;

  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const IntelligenceContext =
  createContext<IntelligenceContextType | undefined>(
    undefined
  );

interface IntelligenceProviderProps {
  children: ReactNode;
}

export const IntelligenceProvider: React.FC<
  IntelligenceProviderProps
> = ({ children }) => {
  const [currentRiskScore, setCurrentRiskScore] =
    useState<number>(0);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const [alerts, setAlerts] =
    useState<IntelligenceItem[]>([]);

  const [threats, setThreats] =
    useState<IntelligenceItem[]>([]);

  const [investigations, setInvestigations] =
    useState<IntelligenceItem[]>([]);

  const [events, setEvents] =
    useState<IntelligenceItem[]>([]);

  // FIX: EntityPanel requires this array
  const [entities, setEntities] =
    useState<Entity[]>([]);

  // FIX: NetworkGraph requires network data
  const [networkData, setNetworkData] =
    useState<NetworkItem[]>([]);

  const [soundActive, setSoundActive] =
    useState<boolean>(false);

  const [defconLevel, setDefconLevel] =
    useState<number>(3);

  const [isSearchOpen, setIsSearchOpen] =
    useState<boolean>(false);

  const toggleSoundState = () => {
    setSoundActive((previous) => !previous);
  };

  const addToast = (toast: Toast) => {
    const id =
      toast.id ||
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

    const newToast: Toast = {
      ...toast,
      id,
    };

    setToasts((previous) => [
      ...previous,
      newToast,
    ]);

    setTimeout(() => {
      setToasts((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <IntelligenceContext.Provider
      value={{
        currentRiskScore,
        setCurrentRiskScore,

        toasts,
        addToast,
        removeToast,

        alerts,
        threats,
        investigations,
        events,

        entities,
        networkData,

        setAlerts,
        setThreats,
        setInvestigations,
        setEvents,

        setEntities,
        setNetworkData,

        soundActive,
        toggleSoundState,

        defconLevel,
        setDefconLevel,

        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </IntelligenceContext.Provider>
  );
};

export const useIntelligence =
  (): IntelligenceContextType => {
    const context = useContext(
      IntelligenceContext
    );

    if (!context) {
      throw new Error(
        "useIntelligence must be used inside IntelligenceProvider"
      );
    }

    return context;
  };

export default IntelligenceContext;