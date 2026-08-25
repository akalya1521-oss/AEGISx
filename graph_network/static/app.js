const svg = document.querySelector('#network');
const details = document.querySelector('#details');
const insights = document.querySelector('#insights');
const timeline = document.querySelector('#timeline');
const patterns = document.querySelector('#patterns');
const overallRisk = document.querySelector('#overall-risk');
const keyEntity = document.querySelector('#key-entity');
const mainBridge = document.querySelector('#main-bridge');
const clusterCountElement = document.querySelector('#cluster-count');
const patternCount = document.querySelector('#pattern-count');
const entityForm = document.querySelector('#entity-form');
const relationshipForm = document.querySelector('#relationship-form');
const pathForm = document.querySelector('#path-form');
const formStatus = document.querySelector('#form-status');

const palette = {
  Person: '#5dc9ff',
  Organization: '#b68cff',
  'Bank Account': '#f7bf5d'
};

let state = {
  nodes: [],
  edges: [],
  selected: null,
  risk: [],
  path: null,
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
    y: (event.clientY - box.top) * 650 / box.height
  };
};

const escape = (value) =>
  String(value).replace(
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
  const radius = Math.min(220, 70 + nodes.length * 16);

  return nodes.map((node, i) => ({
    ...node,
    x: node.x ?? 500 + radius * Math.cos(
      (Math.PI * 2 * i / Math.max(nodes.length, 1)) - Math.PI / 2
    ),
    y: node.y ?? 325 + radius * Math.sin(
      (Math.PI * 2 * i / Math.max(nodes.length, 1)) - Math.PI / 2
    )
  }));
}

function render() {
  const {
    nodes,
    edges,
    selected,
    transform
  } = state;

  const byId = new Map(
    nodes.map(n => [n.id, n])
  );

  const content = [
    `<g transform="translate(${transform.x} ${transform.y}) scale(${transform.scale})">`
  ];

  edges.forEach(edge => {
    const a = byId.get(edge.source);
    const b = byId.get(edge.target);

    if (!a || !b) return;

    const inPath = state.path?.some(
      (id, index) =>
        index &&
        (
          (
            state.path[index - 1] === edge.source &&
            id === edge.target
          ) ||
          (
            state.path[index - 1] === edge.target &&
            id === edge.source
          )
        )
    );

    content.push(`
      <line
        class="link ${inPath ? 'path-link' : ''}"
        x1="${a.x}"
        y1="${a.y}"
        x2="${b.x}"
        y2="${b.y}"
      />

      <text
        class="link-label"
        x="${(a.x + b.x) / 2}"
        y="${(a.y + b.y) / 2 - 8}"
      >
        ${escape(edge.relation || 'linked')}
      </text>
    `);
  });

  nodes.forEach(node => {
    const degree = edges.filter(
      e => e.source === node.id || e.target === node.id
    ).length;

    const size = 22 + degree * 3;

    const risk = state.risk?.find(
      item => item.id === node.id
    );

    content.push(`
      <g class="node-wrap" data-id="${escape(node.id)}">

        <circle
          class="
            node
            ${selected === node.id ? 'selected' : ''}
            ${state.path?.includes(node.id) ? 'path-node' : ''}
            ${risk?.level === 'High' ? 'risk-node' : ''}
          "
          fill="${palette[node.type] || '#91a3b7'}"
          cx="${node.x}"
          cy="${node.y}"
          r="${size}"
        />

        <text
          class="node-label"
          x="${node.x}"
          y="${node.y + 4}"
        >
          ${escape(node.id)}
        </text>

        <text
          class="node-label"
          x="${node.x}"
          y="${node.y + size + 16}"
        >
          ${escape(node.name || node.id)}
        </text>

      </g>
    `);
  });

  svg.innerHTML = content.join('') + '</g>';
}

async function select(id) {
  state.selected = id;

  const node = state.nodes.find(n => n.id === id);

  if (!node) return;

  details.innerHTML = `
    <h2>Entity Intelligence Profile</h2>
    <p>Loading intelligence for <strong>${escape(node.name || id)}</strong>...</p>
  `;

  render();

  try {
    const response = await fetch(
      `/analysis/entity/${encodeURIComponent(id)}`,
      { cache: 'no-store' }
    );

    const profile = await response.json();

    if (!response.ok) {
      throw new Error(
        profile.detail || 'Unable to load entity intelligence.'
      );
    }

    const risk = profile.risk || {};
    const activities = profile.recent_activity || [];

    details.innerHTML = `
      <h2>Entity Intelligence Profile</h2>

      <p>
        <strong>${escape(profile.name)}</strong><br>
        ${escape(profile.id)} · ${escape(profile.type)}
      </p>

      <div class="selected-risk">
        <strong>Risk assessment</strong>

        <p>Score: <strong>${risk.score ?? 0}/100</strong></p>

        <p>Level: <strong>${escape(risk.level ?? 'Unknown')}</strong></p>

        <p>Connectivity: ${risk.connectivity_score ?? 0}/100</p>

        <p>Bridge influence: ${risk.bridge_influence ?? 0}/100</p>

        <p>
          Direct connections:
          <strong>${profile.connection_count}</strong>
        </p>

        <p>
          Influence rank:
          <strong>#${profile.influence_rank}</strong>
        </p>
      </div>

      <h3>Connected to</h3>

      ${
        profile.connections.length
          ? `
            <div class="profile-connections">
              ${profile.connections.map(connection => `
                <div class="profile-connection">
                  <strong>${escape(connection.name)}</strong>
                  <span>
                    ${escape(connection.id)}
                    · ${escape(connection.relationship)}
                  </span>
                </div>
              `).join('')}
            </div>
          `
          : '<p>No direct connections found.</p>'
      }

      <h3 class="activity-heading">Recent activity</h3>

      ${
        activities.length
          ? `
            <div class="profile-activity">
              ${activities.map(event => `
                <div class="profile-event">
                  <strong>${escape(event.type || 'INTELLIGENCE')}</strong>
                  <span>${escape(event.time || '')}</span>
                  <p>${escape(event.message || '')}</p>
                </div>
              `).join('')}
            </div>
          `
          : '<p class="no-activity">No recent activity for this entity.</p>'
      }
    `;

  } catch (error) {
    details.innerHTML = `
      <h2>Entity Intelligence Profile</h2>
      <p>${escape(error.message)}</p>
    `;
  }
}

function renderInsights(centrality, clusters, risks) {
  const ranked = Object.entries(centrality)
    .sort(
      ([, a], [, b]) =>
        b.degree - a.degree ||
        b.betweenness - a.betweenness
    )
    .slice(0, 3);

  if (!ranked.length) {
    insights.innerHTML = `
      <h2>Intelligence insights</h2>
      <p>Add entities to generate analysis.</p>
    `;

    return;
  }

  const clusterCount = clusters.length;

  insights.innerHTML = `
    <h2>Intelligence insights</h2>

    <p>
      ${clusterCount}
      network cluster${clusterCount === 1 ? '' : 's'}
      detected
    </p>

    ${ranked.map(([id, score], index) => {
      const node = state.nodes.find(
        n => n.id === id
      );

      return `
        <button
          class="insight-item"
          type="button"
          data-id="${escape(id)}"
        >
          <span>
            <strong>
              ${
                index === 0
                  ? 'Key entity'
                  : `Influence #${index + 1}`
              }
            </strong>

            ${escape(node?.name || id)}
          </span>

          <span>
            ${Math.round(score.degree * 100)}% connected
          </span>
        </button>
      `;
    }).join('')}

    <p class="cluster-note">
      ${
        clusterCount === 1
          ? 'All entities are currently connected.'
          : 'Separate clusters may indicate distinct groups or missing intelligence links.'
      }
    </p>

    <h3 class="risk-heading">
      Risk watchlist
    </h3>

    <div class="risk-table">

      <div class="risk-header">
        <span>Entity</span>
        <span>Score</span>
        <span>Level</span>
        <span>Connect</span>
        <span>Connectivity</span>
        <span>Bridge</span>
      </div>

      ${
        risks.length
          ? risks.map(item => {
              const node = state.nodes.find(
                n => n.id === item.id
              );

              return `
                <div class="risk-row">

  <span class="risk-entity">
    ${escape(node?.name || item.id)}
  </span>

  <strong class="risk-score">
    ${item.score}/100
  </strong>

  <span
    class="
      risk-badge
      risk-${item.level.toLowerCase()}
    "
  >
    ${escape(item.level)}
  </span>

  <span>
    ${item.connections}
  </span>

  <span>
    ${item.connectivity_score}
  </span>

  <span>
    ${item.bridge_influence}
  </span>

</div>

<div class="risk-reason">
  ${
    item.connectivity_score >= 60
      ? 'Highly connected'
      : item.connectivity_score >= 30
        ? 'Moderately connected'
        : 'Limited connections'
  }
  ·
  ${
    item.bridge_influence >= 60
      ? 'Strong bridge influence'
      : item.bridge_influence >= 30
        ? 'Moderate bridge influence'
        : 'Low bridge influence'
  }
</div>
              `;
            }).join('')
          : `
            <p>No risk data available.</p>
          `
      }

    </div>
  `;

  insights
    .querySelectorAll('[data-id]')
    .forEach(button => {
      button.addEventListener(
        'click',
        () => select(button.dataset.id)
      );
    });
}

function populateEntityChoices() {
  const choices = state.nodes
    .map(node => `
      <option value="${escape(node.id)}">
        ${escape(node.id)} - ${escape(node.name || node.id)}
      </option>
    `)
    .join('');

  relationshipForm.elements.source.innerHTML = choices;
  relationshipForm.elements.target.innerHTML = choices;
  pathForm.elements.node1.innerHTML = choices;
  pathForm.elements.node2.innerHTML = choices;

  if (state.nodes.length > 1) {
    relationshipForm.elements.target.selectedIndex = 1;
    pathForm.elements.node2.selectedIndex = 1;
  }
}

function showFormStatus(message, kind) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${kind}`;
}

async function submitForm(form, url) {
  const submit = form.querySelector('[type="submit"]');

  const payload = Object.fromEntries(
    new FormData(form)
  );

  if (
    url === '/relationships' &&
    payload.source === payload.target
  ) {
    showFormStatus(
      'Choose two different entities for a relationship.',
      'error'
    );

    return;
  }

  submit.disabled = true;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.detail ||
        'Unable to save this intelligence.'
      );
    }

    showFormStatus(
      result.message,
      'success'
    );

    form.reset();

    await refresh();

  } catch (error) {
    showFormStatus(
      error.message,
      'error'
    );
  } finally {
    submit.disabled = false;
  }
}
function renderPatterns(items) {
  if (!items.length) {
    patterns.innerHTML = `
      <h2>Suspicious patterns</h2>
      <p>No suspicious patterns detected.</p>
    `;
    return;
  }

  patterns.innerHTML = `
    <h2>Suspicious patterns</h2>

    <div class="patterns-list">
      ${items.map(item => {
        const node = state.nodes.find(n => n.id === item.entity);

        return `
          <button
            class="pattern-item pattern-${item.severity.toLowerCase()}"
            type="button"
            data-id="${escape(item.entity)}"
          >
            <strong>${escape(item.type)}</strong>

            <span class="pattern-severity">
              ${escape(item.severity)}
            </span>

            <span>
              ${escape(node?.name || item.entity)}
            </span>

            <small>${escape(item.message)}</small>
          </button>
        `;
      }).join('')}
    </div>
  `;

  patterns.querySelectorAll('[data-id]').forEach(button => {
    button.addEventListener('click', () => {
      select(button.dataset.id);
    });
  });
}
function renderIntelligenceSummary(centrality, clusters, risks, patternItems) {
  const ranked = Object.entries(centrality)
    .sort(
      ([, a], [, b]) =>
        b.degree - a.degree ||
        b.betweenness - a.betweenness
    );

  const key = ranked[0];
  const bridge = [...Object.entries(centrality)]
    .sort(([, a], [, b]) => b.betweenness - a.betweenness)[0];

  const highRisk = risks.filter(
    item => item.level === 'High'
  ).length;

  const mediumRisk = risks.filter(
    item => item.level === 'Medium'
  ).length;

  const overall =
    highRisk > 0
      ? 'HIGH'
      : mediumRisk > 0
        ? 'MEDIUM'
        : 'LOW';

  const keyNode = key
    ? state.nodes.find(n => n.id === key[0])
    : null;

  const bridgeNode = bridge
    ? state.nodes.find(n => n.id === bridge[0])
    : null;

  overallRisk.textContent = overall;
  keyEntity.textContent = keyNode?.name || key?.[0] || '—';
  mainBridge.textContent = bridgeNode?.name || bridge?.[0] || '—';
  clusterCountElement.textContent = clusters.length;
  patternCount.textContent = patternItems.length;

  overallRisk.className =
    `summary-risk risk-${overall.toLowerCase()}`;
}
async function refresh() {
  try {
    const [
      networkResponse,
      centralityResponse,
      clustersResponse,
      riskResponse,
      timelineResponse,
      patternsResponse
    ] = await Promise.all([
      fetch('/network', {
        cache: 'no-store'
      }),

      fetch('/analysis/centrality', {
        cache: 'no-store'
      }),

      fetch('/analysis/clusters', {
        cache: 'no-store'
      }),

      fetch('/analysis/risk', {
        cache: 'no-store'
      }),

      fetch('/analysis/timeline', {
        cache: 'no-store'
      }),
      fetch('/analysis/patterns', {
        cache: 'no-store'
      })
    ]);

    if (
      ![
        networkResponse,
        centralityResponse,
        clustersResponse,
        riskResponse,
        timelineResponse,
        patternsResponse
      ].every(response => response.ok)
    ) {
      throw new Error('Unable to load intelligence data.');
    }

    const [
      data,
      centrality,
      clusterData,
      riskData,
      timelineData,
      patternsData
    ] = await Promise.all([
      networkResponse.json(),
      centralityResponse.json(),
      clustersResponse.json(),
      riskResponse.json(),
      timelineResponse.json(),
      patternsResponse.json()
    ]);

    const previous = new Map(
      state.nodes.map(n => [n.id, n])
    );

    state.nodes = layout(
      data.nodes.map(n => ({
        ...n,
        ...previous.get(n.id)
      }))
    );

    state.edges = data.edges;
    state.risk = riskData.entities || [];

    document.querySelector('#entity-count').textContent =
      state.nodes.length;

    document.querySelector('#relationship-count').textContent =
      state.edges.length;

    document.querySelector('#type-count').textContent =
      new Set(state.nodes.map(n => n.type)).size;

    document.querySelector('#network-summary').textContent =
      `${state.nodes.length} entities · ${state.edges.length} relationships`;

    document.querySelector('#updated-at').textContent =
      `updated ${new Date().toLocaleTimeString()}`;

    render();

    renderInsights(
      centrality,
      clusterData.clusters || [],
      state.risk
    );

    renderTimeline(
      timelineData.events || []
    );
    renderPatterns(
      patternsData.patterns || []
    );
    renderIntelligenceSummary(
      centrality,
      clusterData.clusters,
      state.risk,
      patternsData.patterns || []
    );
    populateEntityChoices();

  } catch (error) {
    console.error('Dashboard refresh error:', error);

    document.querySelector('#updated-at').textContent =
      'reconnecting…';
  }
}
svg.addEventListener(
  'pointerdown',
  e => {
    const wrapper =
      e.target.closest('.node-wrap');

    const p = point(e);

    if (wrapper) {
      const node =
        state.nodes.find(
          n => n.id === wrapper.dataset.id
        );

      dragging = {
        id: node.id,
        dx:
          p.x / state.transform.scale -
          state.transform.x -
          node.x,
        dy:
          p.y / state.transform.scale -
          state.transform.y -
          node.y
      };

      select(node.id);

    } else {
      panning = {
        x: p.x,
        y: p.y,
        tx: state.transform.x,
        ty: state.transform.y
      };
    }

    svg.setPointerCapture(e.pointerId);
  }
);

svg.addEventListener(
  'pointermove',
  e => {
    const p = point(e);

    if (dragging) {
      const node =
        state.nodes.find(
          n => n.id === dragging.id
        );

      node.x =
        p.x / state.transform.scale -
        state.transform.x -
        dragging.dx;

      node.y =
        p.y / state.transform.scale -
        state.transform.y -
        dragging.dy;

      render();

    } else if (panning) {
      state.transform.x =
        panning.tx + p.x - panning.x;

      state.transform.y =
        panning.ty + p.y - panning.y;

      render();
    }
  }
);

svg.addEventListener(
  'pointerup',
  () => {
    dragging = null;
    panning = null;
  }
);

svg.addEventListener(
  'wheel',
  e => {
    e.preventDefault();

    state.transform.scale =
      Math.max(
        0.5,
        Math.min(
          2.5,
          state.transform.scale *
            (e.deltaY > 0 ? 0.9 : 1.1)
        )
      );

    render();
  },
  { passive: false }
);

document
  .querySelector('#reset-view')
  .addEventListener(
    'click',
    () => {
      state.transform = {
        x: 0,
        y: 0,
        scale: 1
      };

      state.nodes = layout(
        state.nodes.map(
          ({ x, y, ...node }) => node
        )
      );

      render();
    }
  );

entityForm.addEventListener(
  'submit',
  event => {
    event.preventDefault();

    submitForm(
      entityForm,
      '/entities'
    );
  }
);

relationshipForm.addEventListener(
  'submit',
  event => {
    event.preventDefault();

    submitForm(
      relationshipForm,
      '/relationships'
    );
  }
);

pathForm.addEventListener(
  'submit',
  async event => {
    event.preventDefault();

    const {
      node1,
      node2
    } = Object.fromEntries(
      new FormData(pathForm)
    );

    if (node1 === node2) {
      showFormStatus(
        'Choose two different entities to trace a path.',
        'error'
      );

      return;
    }

    try {
      const response = await fetch(
        `/analysis/connection?node1=${encodeURIComponent(node1)}&node2=${encodeURIComponent(node2)}`
      );

      const result =
        await response.json();

      if (!result.connection) {
        state.path = null;

        showFormStatus(
          'No connection path exists between these entities.',
          'error'
        );

      } else {
        state.path =
          result.connection;

        showFormStatus(
          `Path found: ${result.connection.join(' → ')}`,
          'success'
        );
      }

      render();

    } catch {
      showFormStatus(
        'Unable to analyse the selected path.',
        'error'
      );
    }
  }
);
function renderTimeline(events) {
  if (!events.length) {
    timeline.innerHTML = `
      <h2>Intelligence timeline</h2>
      <p>No new intelligence events recorded yet.</p>
    `;
    return;
  }

  timeline.innerHTML = `
    <h2>Intelligence timeline</h2>

    <div class="timeline-list">
      ${events.map(event => `
        <div class="timeline-event">

          <div class="timeline-time">
            ${escape(event.time)}
          </div>

          <div class="timeline-content">
            <strong>${escape(event.type)}</strong>
            <span>${escape(event.message)}</span>
          </div>

        </div>
      `).join('')}
    </div>
  `;
}
refresh();

setInterval(refresh, 3000);