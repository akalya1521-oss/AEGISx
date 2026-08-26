import React, { useState, useRef, useEffect } from "react";
import { NetworkNode, NetworkLink } from "../types";
import { useIntelligence } from "../context/IntelligenceContext";
import { playCyberSound } from "../utils/audio";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Shield,
  Server,
  Globe,
  Key,
  AlertOctagon,
  Terminal,
} from "lucide-react";

interface NetworkGraphProps {
  nodes?: NetworkNode[];
  links?: NetworkLink[];
  selectedCluster?: string;
  onSelectNode?: (node: NetworkNode) => void;
  height?: number | string;
  isCompact?: boolean;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  nodes = [],
  links = [],
  selectedCluster = "all",
  onSelectNode,
  height = "100%",
  isCompact = false,
}) => {
  const { selectedNode, setSelectedNode } = useIntelligence();

  const svgRef = useRef<SVGSVGElement | null>(null);

  const [zoom, setZoom] = useState(1);

  const [pan, setPan] = useState({
    x: 0,
    y: 0,
  });

  const [isPanning, setIsPanning] =
    useState(false);

  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
  });

  const [nodePositions, setNodePositions] =
    useState<{
      [id: string]: {
        x: number;
        y: number;
      };
    }>({});

  const [draggingNodeId, setDraggingNodeId] =
    useState<string | null>(null);

  /*
   * --------------------------------------------------
   * INITIALIZE NODE POSITIONS
   * --------------------------------------------------
   */

  useEffect(() => {
    const initialPos: {
      [id: string]: {
        x: number;
        y: number;
      };
    } = {};

    nodes.forEach((node, idx) => {
      if (
        node.x !== undefined &&
        node.y !== undefined
      ) {
        initialPos[node.id] = {
          x: node.x,
          y: node.y,
        };
      } else {
        const angle =
          nodes.length > 0
            ? (idx / nodes.length) * 2 * Math.PI
            : 0;

        const radius = isCompact
          ? 140
          : 260;

        initialPos[node.id] = {
          x:
            (isCompact ? 300 : 500) +
            Math.cos(angle) * radius,

          y:
            (isCompact ? 200 : 340) +
            Math.sin(angle) * radius,
        };
      }
    });

    setNodePositions(initialPos);
  }, [nodes, isCompact]);

  /*
   * --------------------------------------------------
   * SAFE FILTERING
   * --------------------------------------------------
   */

  const safeNodes = Array.isArray(nodes)
    ? nodes
    : [];

  const safeLinks = Array.isArray(links)
    ? links
    : [];

  const filteredNodes = safeNodes.filter(
    (node) => {
      if (selectedCluster === "all") {
        return true;
      }

      return (
        node.cluster === selectedCluster
      );
    }
  );

  const filteredNodeIds = new Set(
    filteredNodes.map((node) => node.id)
  );

  const filteredLinks = safeLinks.filter(
    (link) =>
      filteredNodeIds.has(link.source) &&
      filteredNodeIds.has(link.target)
  );

  /*
   * --------------------------------------------------
   * NODE COLOR
   * --------------------------------------------------
   */

  const getNodeColor = (
    node: NetworkNode
  ) => {
    if (node.status === "ISOLATED") {
      return "#64748b";
    }

    if (node.status === "TARGET") {
      return "#38bdf8";
    }

    switch (node.threatLevel) {
      case "CRITICAL":
        return "#ff3b5c";

      case "HIGH":
        return "#ffb800";

      case "MEDIUM":
        return "#00f0ff";

      case "LOW":
        return "#00ff9d";

      default:
        return "#94a3b8";
    }
  };

  /*
   * --------------------------------------------------
   * NODE ICON
   * --------------------------------------------------
   */

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "BOTNET_C2":
        return Server;

      case "DOMAIN":
        return Globe;

      case "CRYPTO_WALLET":
        return Key;

      case "THREAT_ACTOR":
        return AlertOctagon;

      case "IP":
        return Terminal;

      default:
        return Shield;
    }
  };

  /*
   * --------------------------------------------------
   * PAN
   * --------------------------------------------------
   */

  const handleMouseDown = (
    e: React.MouseEvent<SVGSVGElement>
  ) => {
    const target =
      e.target as SVGElement;

    if (
      target.tagName === "svg" ||
      target.id === "graph-bg"
    ) {
      setIsPanning(true);

      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      });
    }
  };

  const handleMouseMove = (
    e: React.MouseEvent<SVGSVGElement>
  ) => {
    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });

      return;
    }

    if (draggingNodeId) {
      if (!svgRef.current) {
        return;
      }

      const rect =
        svgRef.current.getBoundingClientRect();

      const rawX =
        (e.clientX -
          rect.left -
          pan.x) /
        zoom;

      const rawY =
        (e.clientY -
          rect.top -
          pan.y) /
        zoom;

      setNodePositions((previous) => ({
        ...previous,

        [draggingNodeId]: {
          x: rawX,
          y: rawY,
        },
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  /*
   * --------------------------------------------------
   * NODE CLICK
   * --------------------------------------------------
   */

  const handleNodeClick = (
    node: NetworkNode,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    playCyberSound("blip");

    setSelectedNode(node);

    if (onSelectNode) {
      onSelectNode(node);
    }
  };

  /*
   * --------------------------------------------------
   * ZOOM
   * --------------------------------------------------
   */

  const handleZoomIn = () => {
    playCyberSound("click");

    setZoom((z) =>
      Math.min(z + 0.2, 2.5)
    );
  };

  const handleZoomOut = () => {
    playCyberSound("click");

    setZoom((z) =>
      Math.max(z - 0.2, 0.4)
    );
  };

  const handleReset = () => {
    playCyberSound("click");

    setZoom(1);

    setPan({
      x: 0,
      y: 0,
    });
  };

  const viewBox = isCompact
    ? "0 0 600 400"
    : "0 0 1000 680";

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        minHeight: isCompact
          ? 300
          : 500,
        overflow: "hidden",
      }}
    >
      <svg
        ref={svgRef}
        viewBox={viewBox}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <filter
            id="glow-red"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="6"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id="glow-cyan"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="6"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient
            id="link-grad-crit"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#ff3b5c"
              stopOpacity="0.8"
            />

            <stop
              offset="50%"
              stopColor="#00f0ff"
              stopOpacity="0.6"
            />

            <stop
              offset="100%"
              stopColor="#ff3b5c"
              stopOpacity="0.8"
            />
          </linearGradient>

          <pattern
            id="grid-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(0, 240, 255, 0.04)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect
          id="graph-bg"
          width="100%"
          height="100%"
          fill="url(#grid-pattern)"
        />

        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
        >
          <circle
            cx={isCompact ? 300 : 500}
            cy={isCompact ? 200 : 340}
            r="180"
            fill="none"
            stroke="rgba(0, 240, 255, 0.06)"
            strokeDasharray="4 6"
          />

          <circle
            cx={isCompact ? 300 : 500}
            cy={isCompact ? 200 : 340}
            r="300"
            fill="none"
            stroke="rgba(0, 240, 255, 0.04)"
            strokeDasharray="6 8"
          />

          {/* LINKS */}

          {filteredLinks.map(
            (link, idx) => {
              const srcPos =
                nodePositions[
                  link.source
                ];

              const tgtPos =
                nodePositions[
                  link.target
                ];

              if (
                !srcPos ||
                !tgtPos
              ) {
                return null;
              }

              const isCritical =
                link.threatLevel ===
                "CRITICAL";

              const linkColor =
                isCritical
                  ? "rgba(255, 59, 92, 0.65)"
                  : "rgba(0, 240, 255, 0.35)";

              return (
                <g
                  key={`link-${idx}`}
                >
                  <line
                    x1={srcPos.x}
                    y1={srcPos.y}
                    x2={tgtPos.x}
                    y2={tgtPos.y}
                    stroke={linkColor}
                    strokeWidth={
                      isCritical
                        ? 2.5
                        : 1.5
                    }
                    strokeDasharray={
                      link.type ===
                      "DATA_EXFILTRATION"
                        ? "6 4"
                        : "none"
                    }
                  />

                  {link.active && (
                    <circle
                      r={
                        isCritical
                          ? 3.5
                          : 2.5
                      }
                      fill={
                        isCritical
                          ? "#ff3b5c"
                          : "#00f0ff"
                      }
                      filter={
                        isCritical
                          ? "url(#glow-red)"
                          : "url(#glow-cyan)"
                      }
                    >
                      <animateMotion
                        path={`M ${srcPos.x} ${srcPos.y} L ${tgtPos.x} ${tgtPos.y}`}
                        dur={
                          isCritical
                            ? "1.8s"
                            : "3.2s"
                        }
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {!isCompact && (
                    <text
                      x={
                        (srcPos.x +
                          tgtPos.x) /
                        2
                      }
                      y={
                        (srcPos.y +
                          tgtPos.y) /
                          2 -
                        4
                      }
                      fill="rgba(142, 159, 181, 0.7)"
                      fontSize="9"
                      fontFamily="var(--font-mono)"
                      textAnchor="middle"
                    >
                      {link.protocol}
                    </text>
                  )}
                </g>
              );
            }
          )}

          {/* NODES */}

          {filteredNodes.map(
            (node) => {
              const pos =
                nodePositions[
                  node.id
                ] || {
                  x: 400,
                  y: 300,
                };

              const isSelected =
                selectedNode?.id ===
                node.id;

              const nodeColor =
                getNodeColor(node);

              const isCrit =
                node.threatLevel ===
                "CRITICAL";

              const IconComponent =
                getNodeIcon(
                  node.type
                );

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  style={{
                    cursor: "pointer",
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();

                    setDraggingNodeId(
                      node.id
                    );
                  }}
                  onClick={(e) =>
                    handleNodeClick(
                      node,
                      e
                    )
                  }
                >
                  <circle
                    r={
                      isSelected
                        ? 28
                        : node.isC2
                        ? 24
                        : 18
                    }
                    fill={nodeColor}
                    fillOpacity={
                      isSelected
                        ? 0.25
                        : 0.12
                    }
                    stroke={nodeColor}
                    strokeWidth={
                      isSelected
                        ? 2
                        : 1
                    }
                    strokeDasharray={
                      isSelected
                        ? "4 2"
                        : "none"
                    }
                    filter={
                      isCrit
                        ? "url(#glow-red)"
                        : "url(#glow-cyan)"
                    }
                  />

                  <circle
                    r={
                      node.isC2
                        ? 14
                        : 11
                    }
                    fill="#0a101b"
                    stroke={nodeColor}
                    strokeWidth="2"
                  />

                  <circle
                    r={
                      node.isC2
                        ? 5
                        : 3.5
                    }
                    fill={nodeColor}
                  />

                  <text
                    x="0"
                    y={
                      node.isC2
                        ? 26
                        : 22
                    }
                    fill={
                      isSelected
                        ? "#ffffff"
                        : "#cbd5e1"
                    }
                    fontSize={
                      isCompact
                        ? 9
                        : 11
                    }
                    fontFamily="var(--font-mono)"
                    fontWeight={
                      isSelected
                        ? 700
                        : 500
                    }
                    textAnchor="middle"
                  >
                    {(node.label ||
                      node.id ||
                      "NODE"
                    ).length > 24
                      ? (
                          node.label ||
                          node.id ||
                          "NODE"
                        ).substring(
                          0,
                          22
                        ) + "…"
                      : node.label ||
                        node.id ||
                        "NODE"}
                  </text>

                  {!isCompact && (
                    <g transform="translate(0, -18)">
                      <rect
                        x="-14"
                        y="-10"
                        width="28"
                        height="12"
                        rx="2"
                        fill="#06090e"
                        stroke={nodeColor}
                        strokeWidth="1"
                      />

                      <text
                        x="0"
                        y="-1"
                        fill={nodeColor}
                        fontSize="8"
                        fontFamily="var(--font-mono)"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {node.threatScore ??
                          0}
                      </text>
                    </g>
                  )}
                </g>
              );
            }
          )}

          {/* EMPTY STATE */}

          {filteredNodes.length ===
            0 && (
            <text
              x={
                isCompact
                  ? 300
                  : 500
              }
              y={
                isCompact
                  ? 200
                  : 340
              }
              fill="#64748b"
              fontSize="14"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
            >
              NO NETWORK DATA
            </text>
          )}
        </g>
      </svg>

      {/* CONTROLS */}

      <div className="network-tools-dock">
        <button
          className="network-dock-btn"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>

        <button
          className="network-dock-btn"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          className="network-dock-btn"
          onClick={handleReset}
          title="Reset View"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* HUD */}

      <div className="network-hud-overlay">
        <div className="network-hud-tag">
          TOPOLOGY:{" "}
          {filteredNodes.length} NODES
          {" // "}
          {filteredLinks.length} MESH HOPS
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;