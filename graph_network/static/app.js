const svg = document.querySelector('#network');
const details = document.querySelector('#details');
const timelineList = document.querySelector('#timeline-list');
const patternsContainer = document.querySelector('#patterns');

// Top Highlight KPI Elements
const keyEntity = document.querySelector('#key-entity');
const keyEntityScore = document.querySelector('#key-entity-score');
const mainBridge = document.querySelector('#main-bridge');
const mainBridgeSub = document.querySelector('#main-bridge-sub');
const clusterCountElement = document.querySelector('#cluster-count');
const clusterSub = document.querySelector('#cluster-sub');
const patternCount = document.querySelector('#pattern-count');
const patternSub = document.querySelector('#pattern-sub');
const densityCountElement = document.querySelector('#density-count');
const densitySub = document.querySelector('#density-sub');
const avgDegreeElement = document.querySelector('#avg-degree');
const isolateSub = document.querySelector('#isolate-sub');
const typeCountBadge = document.querySelector('#type-count-badge');

// Lists & Panels
const importanceList = document.querySelector('#importance-list');
const communityList = document.querySelector('#community-list');
const bridgeList = document.querySelector('#bridge-list');
const rolesList = document.querySelector('#roles-list');
const potentialLinksList = document.querySelector('#potential-links-list');
const pathResultsContainer = document.querySelector('#path-results-container');

// Forms
const entityForm = document.querySelector('#entity-form');
const relationshipForm = document.querySelector('#relationship-form');
const pathForm = document.querySelector('#path-form');
const formStatus = document.querySelector('#form-status');

const palette = {
  Person: '#5dc9ff',
  Organization: '#b68cff',
  'Bank Account': '#f7bf5d'
};

const roleClasses = {
  NETWORK_HUB: 'role-hub',
  BRIDGE_CONNECTOR: 'role-bridge',
  COMMUNITY_CORE: 'role-core',
  LOCAL_CONNECTOR: 'role-local',
  PERIPHERAL_ENTITY: 'role-peripheral',
  ISOLATED_ENTITY: 'role-isolated'
};

let state = {
  nodes: [],
  edges: [],
  selected: null,
  roles: {},
  bridges: {},
  path: null,
  pathSteps: [],
  transform: {
    x: 0,
    y: 0,
    scale: 1
  }
};

let dragging = null;
let panning = null;

const point = (event) => {
  const box = svg.getBoundingClientRect();
  return {
    x: (event.clientX - box.left) * 1000 / box.width,
    y: (event.clientY - box.top) * 600 / box.height
  };
};

const escape = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[c]
  );

function layout(nodes) {
  const radius = Math.min(235, 80 + nodes.length * 20);
  return nodes.map((node, i) => ({
    ...node,
    x: node.x ?? 500 + radius * Math.cos((Math.PI * 2 * i / Math.max(nodes.length, 1)) - Math.PI / 2),
    y: node.y ?? 300 + radius * Math.sin((Math.PI * 2 * i / Math.max(nodes.length, 1)) - Math.PI / 2)
  }));
}

function render() {
  const { nodes, edges, selected, transform, path, bridges } = state;
  const byId = new Map(nodes.map(n => [n.id, n]));
  const artPoints = new Set(bridges?.articulation_points || []);

  const content = [
    `<g transform="translate(${transform.x} ${transform.y}) scale(${transform.scale})">`
  ];

  // Draw Edges
  edges.forEach(edge => {
    const a = byId.get(edge.source);
    const b = byId.get(edge.target);
    if (!a || !b) return;

    const inPath = path?.some(
      (id, index) =>
        index > 0 &&
        ((path[index - 1] === edge.source && id === edge.target) ||
         (path[index - 1] === edge.target && id === edge.source))
    );

    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;

    content.push(`
      <line
        class="link ${inPath ? 'path-link' : ''}"
        x1="${a.x}"
        y1="${a.y}"
        x2="${b.x}"
        y2="${b.y}"
      />
      <rect
        x="${midX - 38}"
        y="${midY - 16}"
        width="76"
        height="18"
        rx="4"
        fill="#07121e"
        fill-opacity="0.85"
        stroke="#1c3b5a"
        stroke-width="1"
      />
      <text
        class="link-label"
        x="${midX}"
        y="${midY - 3}"
      >
        ${escape(edge.relationship || edge.relation || 'linked')}
      </text>
    `);
  });

  // Draw Nodes
  nodes.forEach(node => {
    const degree = node.degree ?? edges.filter(e => e.source === node.id || e.target === node.id).length;
    const size = 24 + Math.min(degree * 4.5, 30);
    const isBridge = artPoints.has(node.id);
    const isSelected = selected === node.id;
    const inPath = path?.includes(node.id);

    content.push(`
      <g class="node-wrap" data-id="${escape(node.id)}" style="cursor:pointer;">
        <circle
          class="
            node
            ${isSelected ? 'selected' : ''}
            ${inPath ? 'path-node' : ''}
            ${isBridge ? 'bridge-node' : ''}
          "
          fill="${palette[node.type] || '#91a3b7'}"
          cx="${node.x}"
          cy="${node.y}"
          r="${size}"
        />
        <text
          class="node-label"
          x="${node.x}"
          y="${node.y + 5}"
        >
          ${escape(node.id)}
        </text>
        <text
          class="node-label"
          x="${node.x}"
          y="${node.y + size + 18}"
          style="font-size:12px; fill:#e0edf7;"
        >
          ${escape(node.name || node.label || node.id)}
        </text>
      </g>
    `);
  });

  svg.innerHTML = content.join('') + '</g>';
}

// Select an entity and load its Graph Intelligence profile
async function select(id) {
  state.selected = id;
  const node = state.nodes.find(n => n.id === id);

  details.innerHTML = `
    <div class="section-header">
      <h3 class="section-title">Entity Intelligence Profile</h3>
      <span class="section-badge">LOADING…</span>
    </div>
    <div class="empty-state">Loading structural intelligence for <strong>${escape(node?.name || id)}</strong>…</div>
  `;
  render();

  try {
    const response = await fetch(`/graph/entity/${encodeURIComponent(id)}`, { cache: 'no-store' });
    const profile = await response.json();
    console.log("RAW API RESPONSE (/graph/entity):", profile);

    if (!response.ok) {
      throw new Error(profile.detail || 'Unable to load entity intelligence.');
    }

    const roleInfo = profile.role || {};
    const roleKey = roleInfo.role || 'LOCAL_CONNECTOR';
    const roleClass = roleClasses[roleKey] || 'role-local';
    const metrics = profile.importance_metrics || {};
    const bridgeInfo = profile.bridge_information || {};
    const facts = profile.explanation_facts || [];
    const connections = profile.connections || [];

    details.innerHTML = `
      <div class="section-header">
        <h3 class="section-title">Entity Intelligence Profile</h3>
        <span class="section-badge">${escape(profile.id)}</span>
      </div>
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-title">
            <strong>${escape(profile.name)}</strong>
            <span>${escape(profile.id)} · ${escape(profile.type)}</span>
          </div>
          <span class="role-badge ${roleClass}">
            ${escape(roleInfo.role_label || roleKey.replace('_', ' '))}
          </span>
        </div>

        <div class="metrics-mini-grid">
          <div>
            <small>Degree</small>
            <strong>${metrics.degree_centrality ?? profile.connection_count}</strong>
          </div>
          <div>
            <small>Betweenness</small>
            <strong>${metrics.betweenness_centrality ?? '0.00'}</strong>
          </div>
          <div>
            <small>Closeness</small>
            <strong>${metrics.closeness_centrality ?? '0.00'}</strong>
          </div>
          <div>
            <small>PageRank</small>
            <strong>${metrics.pagerank ?? '0.000'}</strong>
          </div>
        </div>

        <div style="margin: 12px 0; font-size: 0.84rem; background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
          <p style="margin: 3px 0;"><strong>Community Cluster:</strong> ${escape(profile.community?.community_id || 'N/A')} (${profile.community?.size || 1} members)</p>
          <p style="margin: 3px 0;"><strong>Structural Role:</strong> ${bridgeInfo.is_articulation_point ? '<span style="color:#ff7675; font-weight:700;">Articulation Point (Bottleneck)</span>' : (bridgeInfo.is_bridge ? '<span style="color:#fab1a0; font-weight:700;">Bridge Connector</span>' : '<span style="color:#93c5fd;">Cluster Member</span>')}</p>
          ${bridgeInfo.removal_impact && bridgeInfo.removal_impact !== 'None' ? `<p style="margin: 3px 0; color:#ff7675; font-size:0.78rem;">⚠ ${escape(bridgeInfo.removal_impact)}</p>` : ''}
        </div>

        <h4 style="font-size: 0.8rem; text-transform: uppercase; color: #5dc9ff; margin: 14px 0 6px; letter-spacing: 0.06em;">Explainable Graph Facts</h4>
        ${
          facts.length
            ? `<ul class="facts-list">
                ${facts.map(fact => `<li>${escape(fact)}</li>`).join('')}
               </ul>`
            : '<div class="empty-state">No graph explanation facts available for this node.</div>'
        }

        <h4 style="font-size: 0.8rem; text-transform: uppercase; color: #5dc9ff; margin: 16px 0 8px; letter-spacing: 0.06em;">Direct Network Links (${connections.length})</h4>
        ${
          connections.length
            ? `<div style="display:flex; flex-direction:column; gap:8px;">
                ${connections.map(c => `
                  <div class="rank-item" style="padding:8px 12px;" onclick="select('${escape(c.id)}')">
                    <div>
                      <span class="rank-name">${escape(c.name)}</span>
                      <small style="color:#8da4ba; margin-left:6px;">(${escape(c.id)})</small>
                    </div>
                    <span class="path-rel-tag">[${escape(c.relationship)}]</span>
                  </div>
                `).join('')}
               </div>`
            : '<div class="empty-state">Isolated node with no direct connections.</div>'
        }
      </div>
    `;
  } catch (err) {
    console.error("Entity profile error:", err);
    details.innerHTML = `
      <div class="section-header">
        <h3 class="section-title">Entity Intelligence Profile</h3>
      </div>
      <div class="empty-state" style="color:#ff7675;">${escape(err.message)}</div>
    `;
  }
}

// Render Structural Importance Rankings
function renderImportance(rankings) {
  if (!rankings || !rankings.length) {
    importanceList.innerHTML = '<div class="empty-state">No entities ranked in the active network.</div>';
    return;
  }

  importanceList.innerHTML = rankings.slice(0, 5).map(item => `
    <button class="rank-item" type="button" onclick="select('${escape(item.id)}')">
      <div>
        <span class="rank-num">#${item.rank}</span>
        <span class="rank-name">${escape(item.name)}</span>
        <small style="color:#8da4ba; margin-left:4px;">(${escape(item.id)})</small>
      </div>
      <div style="text-align:right;">
        <span class="rank-score">Score ${item.structural_importance_score}</span>
        <small style="display:block; font-size:10px; color:#8da4ba; font-weight:600;">${escape(item.connectivity_rank_label)}</small>
      </div>
    </button>
  `).join('');
}

// Render Community Clusters
function renderCommunities(communities) {
  document.querySelector('#communities-badge').textContent = `${communities?.length || 0} CLUSTERS`;
  if (!communities || !communities.length) {
    communityList.innerHTML = '<div class="empty-state">No community clusters detected.</div>';
    return;
  }

  communityList.innerHTML = communities.map(c => `
    <div class="community-card">
      <div class="community-header">
        <strong>Community ${escape(c.community_id)} (${c.size} members)</strong>
        <span style="color:#55efc4; font-size:11px; font-weight:800;">Density ${(c.density * 100).toFixed(0)}%</span>
      </div>
      <div class="community-meta">
        Cluster Core: <strong style="color:#fff;">${escape(c.central_entity_name || c.central_entity)}</strong> · Internal Links: ${c.internal_edges} · External: ${c.external_edges}
      </div>
      <div class="community-members">
        ${(c.members || []).map(m => `
          <span class="member-chip" onclick="select('${escape(m)}')">${escape(m)}</span>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Render Bridge Intelligence
function renderBridges(bridgeData) {
  const count = bridgeData?.bridge_entities?.length || 0;
  document.querySelector('#bridges-badge').textContent = `${count} BRIDGES`;

  if (!bridgeData || !bridgeData.bridge_entities || !bridgeData.bridge_entities.length) {
    bridgeList.innerHTML = '<div class="empty-state">No critical structural bottlenecks detected in current network.</div>';
    return;
  }

  bridgeList.innerHTML = bridgeData.bridge_entities.map(b => `
    <div class="bridge-card" onclick="select('${escape(b.entity)}')">
      <div class="bridge-header">
        <strong>${escape(b.name)} (${escape(b.entity)})</strong>
        <span class="role-badge role-bridge">Betweenness ${b.betweenness_centrality}</span>
      </div>
      <div class="bridge-impact">
        ⚡ ${escape(b.removal_impact)} (Connects ${b.connects_groups} groups)
      </div>
      <div class="bridge-reason">
        ${escape(b.reason || '')}
      </div>
    </div>
  `).join('');
}

// Render Entity Roles
function renderRoles(rolesData) {
  const roleValues = rolesData ? Object.values(rolesData) : [];
  if (!roleValues.length) {
    rolesList.innerHTML = '<div class="empty-state">No entity roles classified.</div>';
    return;
  }

  rolesList.innerHTML = roleValues.map(r => {
    const roleClass = roleClasses[r.role] || 'role-local';
    return `
      <div class="rank-item" onclick="select('${escape(r.entity)}')">
        <div>
          <span class="rank-name">${escape(r.entity)}</span>
          <span class="role-badge ${roleClass}" style="margin-left:8px;">${escape(r.role_label)}</span>
        </div>
        <small style="color:#8da4ba; font-size:11px; font-weight:500;">${escape(r.reasons?.[0] || '')}</small>
      </div>
    `;
  }).join('');
}

// Render Potential Structural Links
function renderPotentialLinks(linkData) {
  const candidates = linkData?.candidates || [];
  if (!candidates.length) {
    potentialLinksList.innerHTML = '<div class="empty-state">No potential structural links found among current non-edges.</div>';
    return;
  }

  potentialLinksList.innerHTML = candidates.slice(0, 5).map(c => `
    <div class="potential-link-card">
      <div class="potential-link-header">
        <strong>${escape(c.source_name || c.source)} ↔ ${escape(c.target_name || c.target)}</strong>
        <span class="potential-link-score">Proximity ${c.score}</span>
      </div>
      <div class="potential-link-details">
        Shared Anchor Entities: <strong style="color:#fff;">${escape(c.common_neighbors?.join(', ') || 'None')}</strong>
      </div>
      <small class="disclaimer-tag">${escape(c.disclaimer)}</small>
    </div>
  `).join('');
}

// Render Structural Patterns
function renderPatterns(patterns) {
  document.querySelector('#patterns-badge').textContent = `${patterns?.length || 0} PATTERNS`;
  if (!patterns || !patterns.length) {
    patternsContainer.innerHTML = '<div class="empty-state">No structural graph patterns detected.</div>';
    return;
  }

  patternsContainer.innerHTML = patterns.map(p => `
    <div class="pattern-card" onclick="${p.central_entity ? `select('${escape(p.central_entity)}')` : ''}">
      <div class="pattern-header">
        <span class="pattern-type">★ ${escape(p.pattern_type || p.pattern)}</span>
        <small style="color:#8da4ba; font-weight:700;">${escape(p.central_entity || '')}</small>
      </div>
      <p class="pattern-desc">${escape(p.explanation)}</p>
    </div>
  `).join('');
}

// Render Timeline Audit Log
function renderTimeline(events) {
  if (!events || !events.length) {
    timelineList.innerHTML = '<div class="empty-state">No recorded network activity events.</div>';
    return;
  }

  timelineList.innerHTML = events.slice(0, 6).map(e => `
    <div class="timeline-event">
      <div class="timeline-time">${escape(e.time)}</div>
      <div class="timeline-content">
        <strong>${escape(e.type)}</strong>
        <span>${escape(e.message)}</span>
      </div>
    </div>
  `).join('');
}

// Populate Choice Dropdowns
function populateEntityChoices() {
  const choices = state.nodes
    .map(node => `<option value="${escape(node.id)}">${escape(node.id)} - ${escape(node.name || node.label || node.id)}</option>`)
    .join('');

  const currentSource = relationshipForm.elements.source.value;
  const currentTarget = relationshipForm.elements.target.value;
  const currentNode1 = pathForm.elements.node1.value;
  const currentNode2 = pathForm.elements.node2.value;

  relationshipForm.elements.source.innerHTML = choices;
  relationshipForm.elements.target.innerHTML = choices;
  pathForm.elements.node1.innerHTML = choices;
  pathForm.elements.node2.innerHTML = choices;

  if (currentSource) relationshipForm.elements.source.value = currentSource;
  if (currentTarget) relationshipForm.elements.target.value = currentTarget;
  if (currentNode1) pathForm.elements.node1.value = currentNode1;
  if (currentNode2) pathForm.elements.node2.value = currentNode2;

  if (!currentTarget && state.nodes.length > 1) {
    relationshipForm.elements.target.selectedIndex = 1;
  }
  if (!currentNode2 && state.nodes.length > 1) {
    pathForm.elements.node2.selectedIndex = 1;
  }
}

function showFormStatus(message, kind) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${kind}`;
}

// Submit entity or relationship forms
async function submitForm(form, url) {
  const submit = form.querySelector('[type="submit"]');
  const payload = Object.fromEntries(new FormData(form));

  if (url === '/relationships' && payload.source === payload.target) {
    showFormStatus('Choose two different entities for a relationship.', 'error');
    return;
  }

  submit.disabled = true;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    console.log(`RAW API RESPONSE (${url}):`, result);

    if (!response.ok) {
      throw new Error(result.detail || 'Unable to save data.');
    }
    showFormStatus(result.message, 'success');
    form.reset();
    await refresh();
  } catch (error) {
    showFormStatus(error.message, 'error');
  } finally {
    submit.disabled = false;
  }
}

// Master Dashboard Refresh fetching from /graph/* APIs
async function refresh() {
  try {
    const [
      visResponse,
      summaryResponse,
      importanceResponse,
      communitiesResponse,
      bridgesResponse,
      rolesResponse,
      patternsResponse,
      linksResponse,
      timelineResponse
    ] = await Promise.all([
      fetch('/graph/visualization-data', { cache: 'no-store' }),
      fetch('/graph/summary', { cache: 'no-store' }),
      fetch('/graph/nodes/importance?limit=10', { cache: 'no-store' }),
      fetch('/graph/communities', { cache: 'no-store' }),
      fetch('/graph/bridges', { cache: 'no-store' }),
      fetch('/graph/roles', { cache: 'no-store' }),
      fetch('/graph/patterns', { cache: 'no-store' }),
      fetch('/graph/potential-links?top_k=5', { cache: 'no-store' }),
      fetch('/analysis/timeline', { cache: 'no-store' })
    ]);

    if (!visResponse.ok || !summaryResponse.ok) {
      throw new Error('Graph Intelligence APIs returned non-200 status');
    }

    const [
      visData,
      summaryData,
      importanceData,
      communitiesData,
      bridgesData,
      rolesData,
      patternsData,
      linksData,
      timelineData
    ] = await Promise.all([
      visResponse.json(),
      summaryResponse.json(),
      importanceResponse.json(),
      communitiesResponse.json(),
      bridgesResponse.json(),
      rolesResponse.json(),
      patternsResponse.json(),
      linksResponse.json(),
      timelineResponse.json()
    ]);

    console.log("RAW API RESPONSE (/graph/summary):", summaryData);

    const previousPositions = new Map(state.nodes.map(n => [n.id, n]));
    state.nodes = layout(
      (visData.nodes || []).map(n => ({
        ...n,
        ...previousPositions.get(n.id)
      }))
    );
    state.edges = visData.edges || [];
    state.roles = rolesData?.roles || {};
    state.bridges = bridgesData || {};

    // Update Top Highlight KPI Bar (Projector-Ready)
    const topNode = importanceData?.structural_rankings?.[0];
    keyEntity.textContent = topNode ? `${topNode.name} (${topNode.id})` : '—';
    keyEntityScore.textContent = topNode ? `Score: ${topNode.structural_importance_score} · ${topNode.connectivity_rank_label}` : 'No active hub';

    const topBridge = bridgesData?.bridge_entities?.[0];
    mainBridge.textContent = topBridge ? `${topBridge.name} (${topBridge.entity})` : 'None';
    mainBridgeSub.textContent = topBridge ? `Betweenness: ${topBridge.betweenness_centrality} · Articulation Point` : 'No single bottleneck';

    clusterCountElement.textContent = communitiesData?.total_communities ?? 0;
    clusterSub.textContent = `${summaryData.total_nodes ?? 0} entities partitioned`;

    patternCount.textContent = patternsData?.total_patterns ?? 0;
    patternSub.textContent = `${patternsData?.total_patterns || 0} graph motifs active`;

    densityCountElement.textContent = summaryData.graph_density ?? '0.0';
    densitySub.textContent = `${summaryData.total_nodes ?? 0} entities · ${summaryData.total_edges ?? 0} links`;

    avgDegreeElement.textContent = summaryData.average_degree ?? '0.0';
    isolateSub.textContent = `${summaryData.number_of_isolated_nodes ?? 0} isolated nodes`;

    typeCountBadge.textContent = `${new Set(state.nodes.map(n => n.type)).size} TYPES`;

    document.querySelector('#network-summary').textContent =
      `${state.nodes.length} Entities · ${state.edges.length} Links · ${communitiesData?.total_communities || 1} Communities · Density ${summaryData.graph_density || '0.0'}`;
    document.querySelector('#updated-at').textContent = `synced ${new Date().toLocaleTimeString()}`;

    // Render Canvas & Panels
    render();
    renderImportance(importanceData?.structural_rankings || []);
    renderCommunities(communitiesData?.communities || []);
    renderBridges(bridgesData);
    renderRoles(rolesData?.roles || {});
    renderPotentialLinks(linksData);
    renderPatterns(patternsData?.patterns || []);
    renderTimeline(timelineData?.events || []);
    populateEntityChoices();

    // Auto-select top structural entity on initial load if none selected yet
    if (state.selected === null && topNode?.id) {
      select(topNode.id);
    }

  } catch (error) {
    console.error('Dashboard refresh error:', error);
    document.querySelector('#updated-at').textContent = 'reconnecting…';
  }
}

// Pointer Events for SVG Graph interaction (drag, pan, zoom)
svg.addEventListener('pointerdown', e => {
  const wrapper = e.target.closest('.node-wrap');
  const p = point(e);

  if (wrapper) {
    const node = state.nodes.find(n => n.id === wrapper.dataset.id);
    if (node) {
      dragging = {
        id: node.id,
        dx: p.x / state.transform.scale - state.transform.x - node.x,
        dy: p.y / state.transform.scale - state.transform.y - node.y
      };
      select(node.id);
    }
  } else {
    panning = {
      x: p.x,
      y: p.y,
      tx: state.transform.x,
      ty: state.transform.y
    };
  }
  svg.setPointerCapture(e.pointerId);
});

svg.addEventListener('pointermove', e => {
  const p = point(e);
  if (dragging) {
    const node = state.nodes.find(n => n.id === dragging.id);
    if (node) {
      node.x = p.x / state.transform.scale - state.transform.x - dragging.dx;
      node.y = p.y / state.transform.scale - state.transform.y - dragging.dy;
      render();
    }
  } else if (panning) {
    state.transform.x = panning.tx + p.x - panning.x;
    state.transform.y = panning.ty + p.y - panning.y;
    render();
  }
});

svg.addEventListener('pointerup', () => {
  dragging = null;
  panning = null;
});

svg.addEventListener('wheel', e => {
  e.preventDefault();
  state.transform.scale = Math.max(0.5, Math.min(2.5, state.transform.scale * (e.deltaY > 0 ? 0.9 : 1.1)));
  render();
}, { passive: false });

document.querySelector('#reset-view').addEventListener('click', () => {
  state.transform = { x: 0, y: 0, scale: 1 };
  state.path = null;
  state.nodes = layout(state.nodes.map(({ x, y, ...n }) => n));
  pathResultsContainer.innerHTML = '';
  render();
});

// Form Submissions
entityForm.addEventListener('submit', event => {
  event.preventDefault();
  submitForm(entityForm, '/entities');
});

relationshipForm.addEventListener('submit', event => {
  event.preventDefault();
  submitForm(relationshipForm, '/relationships');
});

// Relationship Path Finder Form calling /graph/path
pathForm.addEventListener('submit', async event => {
  event.preventDefault();
  const { node1, node2 } = Object.fromEntries(new FormData(pathForm));

  if (!node1 || !node2) {
    showFormStatus('Select both start and end entities.', 'error');
    return;
  }

  if (node1 === node2) {
    showFormStatus('Choose two different entities to trace a path.', 'error');
    return;
  }

  showFormStatus('Computing shortest structural relationship path…', 'success');

  try {
    const response = await fetch(
      `/graph/path?source=${encodeURIComponent(node1)}&target=${encodeURIComponent(node2)}&include_alternatives=true`
    );
    const result = await response.json();
    console.log("RAW API RESPONSE (/graph/path):", result);

    if (!result.exists) {
      state.path = null;
      showFormStatus(result.message || 'No structural connection path exists between these entities.', 'error');
      pathResultsContainer.innerHTML = `
        <div class="empty-state" style="margin-top:14px; color:#ff7675;">
          No structural connection path exists between <strong>${escape(node1)}</strong> and <strong>${escape(node2)}</strong>.
        </div>
      `;
    } else {
      state.path = result.path_nodes || [];
      showFormStatus(`Path Found: ${result.path_length} Hops (${result.total_weight ? `Weight: ${result.total_weight}` : 'Direct Route'})`, 'success');

      const pathSteps = result.path || [];
      pathResultsContainer.innerHTML = `
        <div class="path-chain">
          ${pathSteps.map((step, idx) => {
            const isStart = idx === 0;
            const targetId = step.target || step.node || '';
            const targetName = step.target_name || step.name || targetId;
            const rel = step.relationship ? `[${step.relationship}]` : '[START]';
            return `
              <div class="path-step">
                <span style="font-weight:800; color:#5dc9ff;">#${idx + 1}</span>
                <span class="path-rel-tag" style="${isStart ? 'background:#257e68;' : ''}">${escape(rel)}</span>
                <strong style="color:#fff;">${escape(targetName)}</strong>
                <small style="color:#8da4ba;">(${escape(targetId)})</small>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
    render();
  } catch (err) {
    console.error("Path analysis error:", err);
    showFormStatus('Unable to analyse the selected path.', 'error');
    pathResultsContainer.innerHTML = '';
  }
});

// Initial load
refresh();

// Periodic live sync every 4 seconds
setInterval(refresh, 4000);