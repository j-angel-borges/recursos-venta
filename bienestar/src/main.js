import './style.css'
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';

const state = {
  asesor: '', nombrePadres: '', celular: '', nombreHijo: '', edadHijo: '',
  importancia1_10: 10, prioridadTech: '', comportamiento: '',
  plataformas: [], horasPantalla: 4,
  riesgoAislamiento: '', riesgoContenido: '', riesgoAnsiedad: '', riesgoIdentidad: ''
};

function showStep(num, direction = 'next') {
  const current = document.querySelector('.step.active');
  const next = document.getElementById(`step-${num}`);
  if(direction === 'next') {
    current.classList.add('exit'); current.classList.remove('active');
    setTimeout(() => { current.classList.remove('exit'); next.classList.add('active'); }, 300);
  } else {
    current.classList.remove('active'); next.classList.add('active');
  }

  // Update Progress Bar
  const progressMap = { 1: 25, 2: 50, 3: 75, 4: 100, 5: 100 };
  const bar = document.getElementById('progressBar');
  const wrapper = document.getElementById('progressWrapper');
  if (bar) bar.style.width = (progressMap[num] || 25) + '%';
  if (wrapper) wrapper.style.display = num === 5 ? 'none' : 'block';
}

function nextStep(currentNum) {
  if(validateStep(currentNum)) { saveStepData(currentNum); showStep(currentNum + 1, 'next'); }
}
function prevStep(currentNum) { showStep(currentNum - 1, 'prev'); }

function validateStep(num) {
  if(num === 1) {
    const inputs = ['asesor', 'nombrePadres', 'celular', 'nombreHijo', 'edadHijo'];
    let valid = true;
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if(!el.value) {
        el.style.borderColor = 'var(--danger)';
        el.style.boxShadow = '0 0 0 3px var(--danger-bg)';
        valid = false;
      } else {
        el.style.borderColor = 'var(--input-border)';
        el.style.boxShadow = 'none';
      }
    });
    return valid;
  }
  if(num === 2) { if(!state.prioridadTech || !state.comportamiento) { alert("Por favor, responda todas las preguntas."); return false; } }
  if(num === 4) { if(!state.riesgoAislamiento || !state.riesgoContenido || !state.riesgoAnsiedad || !state.riesgoIdentidad) { alert("Por favor, califique todos los escenarios."); return false; } }
  return true;
}

function collectAllFormData() {
  const asesorEl = document.getElementById('asesor');
  if (asesorEl && asesorEl.value) state.asesor = asesorEl.value.trim();

  const padresEl = document.getElementById('nombrePadres');
  if (padresEl && padresEl.value) state.nombrePadres = padresEl.value.trim();

  const celEl = document.getElementById('celular');
  if (celEl && celEl.value) state.celular = celEl.value.trim();

  const hijoEl = document.getElementById('nombreHijo');
  if (hijoEl && hijoEl.value) state.nombreHijo = hijoEl.value.trim();

  const edadEl = document.getElementById('edadHijo');
  if (edadEl && edadEl.value) state.edadHijo = edadEl.value.trim();

  const impEl = document.getElementById('importancia1_10');
  if (impEl && impEl.value) state.importancia1_10 = impEl.value;

  const horasEl = document.getElementById('horasPantalla');
  if (horasEl) state.horasPantalla = parseInt(horasEl.innerText) || state.horasPantalla;
}

function saveStepData(num) {
  collectAllFormData();
}

function selectBtnGroup(btn, groupName) {
  const parent = btn.parentElement;
  parent.querySelectorAll('.btn-select').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected'); state[groupName] = btn.getAttribute('data-val');
}

function selectRadio(card, groupName) {
  const parent = card.parentElement;
  parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected'); state[groupName] = card.querySelector('.option-text').innerText;
}

function toggleCheckbox(card) {
  card.classList.toggle('selected');
  const text = card.querySelector('.option-text').innerText;
  if(card.classList.contains('selected')) {
    if(!state.plataformas.includes(text)) state.plataformas.push(text);
  } else { state.plataformas = state.plataformas.filter(t => t !== text); }
}

function updateHours(change) {
  let val = parseInt(document.getElementById('horasPantalla').innerText);
  val += change; if(val < 0) val = 0; if(val > 24) val = 24;
  document.getElementById('horasPantalla').innerText = val; state.horasPantalla = val;
}

function selectRisk(btn, groupName) {
  const parent = btn.parentElement;
  parent.querySelectorAll('.risk-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected'); state[groupName] = btn.getAttribute('data-val');
}

async function submitData() {
  if(validateStep(4)) {
    collectAllFormData();
    showStep(5, 'next');
    
    try {
      const docRef = await addDoc(collection(db, "bienestar_diagnostics"), {
        ...state,
        createdAt: serverTimestamp()
      });
      console.log("Document written with ID: ", docRef.id);
      onSuccess();
    } catch (e) {
      console.error("Error adding document: ", e);
      onError(e.message);
    }
  }
}

function onSuccess() {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('successState').style.display = 'flex';
}

function onError(error) { alert("Error: " + error); resetForm(); }

// Reinicia el formulario sin recargar la página
function resetForm() {
  state.asesor = ''; state.nombrePadres = ''; state.celular = ''; state.nombreHijo = ''; state.edadHijo = '';
  state.importancia1_10 = 10; state.prioridadTech = ''; state.comportamiento = '';
  state.plataformas = []; state.horasPantalla = 4;
  state.riesgoAislamiento = ''; state.riesgoContenido = ''; state.riesgoAnsiedad = ''; state.riesgoIdentidad = '';

  document.getElementById('asesor').value = '';
  document.getElementById('nombrePadres').value = '';
  document.getElementById('celular').value = '';
  document.getElementById('nombreHijo').value = '';
  document.getElementById('edadHijo').value = '';
  
  document.getElementById('importancia1_10').value = 10;
  document.getElementById('sliderVal').innerText = '10';
  document.getElementById('horasPantalla').innerText = '4';

  document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

  document.getElementById('successState').style.display = 'none';
  document.getElementById('loadingState').style.display = 'flex';

  const bar = document.getElementById('progressBar');
  const wrapper = document.getElementById('progressWrapper');
  if (bar) bar.style.width = '25%';
  if (wrapper) wrapper.style.display = 'block';

  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
    step.classList.remove('exit');
  });
  document.getElementById('step-1').classList.add('active');
}

// Bind global functions
window.showStep = showStep;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.validateStep = validateStep;
window.saveStepData = saveStepData;
window.selectBtnGroup = selectBtnGroup;
window.selectRadio = selectRadio;
window.toggleCheckbox = toggleCheckbox;
window.updateHours = updateHours;
window.selectRisk = selectRisk;
window.submitData = submitData;
window.onSuccess = onSuccess;
window.onError = onError;
window.resetForm = resetForm;

// ==========================================
// --- ADMIN DASHBOARD & FICHA TÉCNICA ---
// ==========================================

let adminRecordsCache = [];

function formatTimestamp(ts) {
  if (!ts) return 'Reciente';
  try {
    let date;
    if (ts.toDate) date = ts.toDate();
    else if (ts.seconds) date = new Date(ts.seconds * 1000);
    else date = new Date(ts);
    return date.toLocaleString('es-ES', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
    });
  } catch (e) {
    return 'Reciente';
  }
}

function getRiskBadge(val) {
  if (!val) return '<span class="admin-badge admin-badge-muted">-</span>';
  const v = val.trim().toLowerCase();
  if (v.startsWith('alto')) {
    return `<span class="admin-badge badge-risk-alto">Alto</span>`;
  } else if (v.startsWith('mod')) {
    return `<span class="admin-badge badge-risk-moderado">Moderado</span>`;
  } else {
    return `<span class="admin-badge badge-risk-bajo">Bajo</span>`;
  }
}

window.openAdminModal = async function() {
  let overlay = document.getElementById('adminModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'adminModal';
    overlay.className = 'admin-modal-overlay';
    overlay.innerHTML = `
      <div class="admin-modal-content">
        <div class="admin-modal-header">
          <div class="admin-title-wrap">
            <h2 class="admin-title">📋 Registros de Diagnóstico • ZentryOS</h2>
            <span class="admin-badge-count" id="adminTotalCount">Cargando...</span>
          </div>
          <div class="admin-header-actions">
            <input type="text" id="adminSearchInput" class="admin-search-input" placeholder="🔍 Buscar asesor, familia, celular..." oninput="filterAdminTable()" />
            <button class="admin-btn-tool" onclick="exportAdminCSV()" title="Exportar a CSV">📥 CSV</button>
            <button class="admin-btn-tool" onclick="fetchAdminData()" title="Refrescar">🔄</button>
            <button class="admin-close-btn" onclick="closeAdminModal()">×</button>
          </div>
        </div>
        <div class="admin-modal-body">
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Asesor</th>
                  <th>Familia</th>
                  <th>Celular</th>
                  <th>Menor</th>
                  <th>Impacto Tech</th>
                  <th>Pantalla</th>
                  <th>Matriz de Riesgo</th>
                  <th class="th-actions">Acciones</th>
                </tr>
              </thead>
              <tbody id="adminTableBody">
                <tr><td colspan="9" class="admin-loading-row"><div class="admin-mini-spinner"></div> Cargando registros de GCP...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
  await fetchAdminData();
};

window.closeAdminModal = function() {
  const overlay = document.getElementById('adminModal');
  if (overlay) overlay.style.display = 'none';
};

window.fetchAdminData = async function() {
  const tbody = document.getElementById('adminTableBody');
  const countEl = document.getElementById('adminTotalCount');
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="9" class="admin-loading-row"><div class="admin-mini-spinner"></div> Actualizando desde Google Cloud...</td></tr>';
  }
  try {
    const querySnapshot = await getDocs(collection(db, "bienestar_diagnostics"));
    adminRecordsCache = [];
    querySnapshot.forEach((docSnap) => {
      adminRecordsCache.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Ordenar por fecha descendente
    adminRecordsCache.sort((a, b) => {
      const ta = a.createdAt?.seconds || 0;
      const tb = b.createdAt?.seconds || 0;
      return tb - ta;
    });

    if (countEl) countEl.innerText = `${adminRecordsCache.length} registros`;
    renderAdminRows(adminRecordsCache);
  } catch(e) {
    console.error("Error fetching admin data:", e);
    if (tbody) tbody.innerHTML = `<tr><td colspan="9" style="color: #EF4444; padding: 24px; text-align: center;">Error al cargar datos de Firestore: ${e.message}</td></tr>`;
    if (countEl) countEl.innerText = `Error`;
  }
};

function renderAdminRows(records) {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  if (records.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="admin-empty-row">No se encontraron diagnósticos registrados.</td></tr>';
    return;
  }

  let html = '';
  records.forEach((r) => {
    const dateFormatted = formatTimestamp(r.createdAt);
    const pTechBadge = r.prioridadTech === 'Sí' 
      ? '<span class="admin-badge badge-priority-si">Prioridad Sí</span>' 
      : '<span class="admin-badge badge-priority-no">Prioridad No</span>';
    
    const waLink = r.celular ? `https://wa.me/${r.celular.replace(/\D/g, '')}` : '#';

    html += `
      <tr id="row-${r.id}">
        <td><span class="cell-date">${dateFormatted}</span></td>
        <td><span class="cell-asesor">${r.asesor || 'Sin Asesor'}</span></td>
        <td>
          <div class="cell-family">
            <strong>${r.nombrePadres || 'No indicado'}</strong>
          </div>
        </td>
        <td>
          <div class="cell-phone">
            <span>${r.celular || '-'}</span>
            ${r.celular ? `<a href="${waLink}" target="_blank" class="wa-btn" title="Abrir WhatsApp">💬</a>` : ''}
          </div>
        </td>
        <td>
          <div class="cell-kid">
            <span class="kid-name">${r.nombreHijo || '-'}</span>
            <span class="kid-age">${r.edadHijo ? `${r.edadHijo} años` : ''}</span>
          </div>
        </td>
        <td>
          <div class="cell-tech">
            <span class="cell-score">Desarrollo: <strong>${r.importancia1_10 || 10}/10</strong></span>
            ${pTechBadge}
          </div>
        </td>
        <td>
          <span class="badge-screen-time">${r.horasPantalla || 4} hrs/día</span>
        </td>
        <td>
          <div class="risk-matrix-pills">
            <span title="Aislamiento Social">Aisl: ${getRiskBadge(r.riesgoAislamiento)}</span>
            <span title="Sesgo Contenido">Cont: ${getRiskBadge(r.riesgoContenido)}</span>
            <span title="Ansiedad Notificaciones">Ans: ${getRiskBadge(r.riesgoAnsiedad)}</span>
            <span title="Alteración Identidad">Iden: ${getRiskBadge(r.riesgoIdentidad)}</span>
          </div>
        </td>
        <td class="td-actions">
          <button class="admin-action-btn admin-view-btn" onclick="openDetailModal('${r.id}')" title="Ver Ficha Completa">👁️ Ficha</button>
          <button class="admin-action-btn admin-delete-btn" onclick="deleteRecord('${r.id}')" title="Eliminar">🗑️</button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

window.filterAdminTable = function() {
  const q = (document.getElementById('adminSearchInput')?.value || '').toLowerCase().trim();
  if (!q) {
    renderAdminRows(adminRecordsCache);
    return;
  }
  const filtered = adminRecordsCache.filter(r => {
    return (r.asesor || '').toLowerCase().includes(q) ||
           (r.nombrePadres || '').toLowerCase().includes(q) ||
           (r.celular || '').toLowerCase().includes(q) ||
           (r.nombreHijo || '').toLowerCase().includes(q);
  });
  renderAdminRows(filtered);
};

window.openDetailModal = function(id) {
  const r = adminRecordsCache.find(x => x.id === id);
  if (!r) return;

  let modal = document.getElementById('detailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'detailModal';
    modal.className = 'detail-modal-overlay';
    document.body.appendChild(modal);
  }

  const plats = Array.isArray(r.plataformas) ? r.plataformas : (r.plataformas ? [r.plataformas] : []);
  const platsHtml = plats.length > 0
    ? plats.map(p => `<span class="plat-tag">${p}</span>`).join('')
    : '<span style="color: #94A3B8;">Ninguna especificada</span>';

  modal.innerHTML = `
    <div class="detail-modal-content">
      <div class="detail-modal-header">
        <div>
          <span class="detail-badge-lead">Ficha Técnica de Evaluación</span>
          <h3 class="detail-title">Familia ${r.nombrePadres || 'General'}</h3>
          <p class="detail-meta">Registrado el ${formatTimestamp(r.createdAt)} • Asesor: <strong>${r.asesor || 'No registrado'}</strong></p>
        </div>
        <button class="detail-close-btn" onclick="closeDetailModal()">×</button>
      </div>
      <div class="detail-modal-body">
        
        <div class="detail-grid-2">
          <!-- Datos Familiares -->
          <div class="detail-card">
            <h4 class="detail-card-title">👨‍👩‍👧 Datos del Menor y Padres</h4>
            <div class="detail-row"><span class="detail-lbl">Padre/Madre:</span> <span class="detail-val">${r.nombrePadres || '-'}</span></div>
            <div class="detail-row"><span class="detail-lbl">Celular:</span> <span class="detail-val">${r.celular || '-'} ${r.celular ? `<a href="https://wa.me/${r.celular.replace(/\D/g, '')}" target="_blank" class="wa-text-link">Enviar WhatsApp ↗</a>` : ''}</span></div>
            <div class="detail-row"><span class="detail-lbl">Menor / Edad:</span> <span class="detail-val"><strong>${r.nombreHijo || '-'}</strong> (${r.edadHijo || '?'} años)</span></div>
            <div class="detail-row"><span class="detail-lbl">Horas en Pantalla:</span> <span class="detail-val highlight-val">${r.horasPantalla || 4} horas diarias</span></div>
          </div>

          <!-- Concienciación -->
          <div class="detail-card">
            <h4 class="detail-card-title">🎯 Concienciación & Hábitos</h4>
            <div class="detail-row"><span class="detail-lbl">Importancia Desarrollo Mental:</span> <span class="detail-val"><strong>${r.importancia1_10 || 10} / 10</strong></span></div>
            <div class="detail-row"><span class="detail-lbl">¿Prioridad HOY tecnología?:</span> <span class="detail-val">${r.prioridadTech === 'Sí' ? '<span class="admin-badge badge-priority-si">Sí</span>' : '<span class="admin-badge badge-priority-no">No</span>'}</span></div>
            <div class="detail-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
              <span class="detail-lbl">Comportamiento Observado:</span>
              <span class="detail-val-quote">“${r.comportamiento || 'Sin observaciones'}”</span>
            </div>
          </div>
        </div>

        <!-- Plataformas -->
        <div class="detail-card" style="margin-top: 14px;">
          <h4 class="detail-card-title">📱 Plataformas de Mayor Consumo</h4>
          <div class="detail-plats-wrap">${platsHtml}</div>
        </div>

        <!-- Matriz de Riesgo -->
        <div class="detail-card" style="margin-top: 14px;">
          <h4 class="detail-card-title">⚠️ Matriz de Escenarios de Riesgo</h4>
          <div class="detail-risk-grid">
            <div class="risk-item">
              <span class="risk-item-name">Aislamiento Social Progresivo</span>
              <div class="risk-item-badge">${getRiskBadge(r.riesgoAislamiento)}</div>
            </div>
            <div class="risk-item">
              <span class="risk-item-name">Sesgo de Contenido & Apuestas</span>
              <div class="risk-item-badge">${getRiskBadge(r.riesgoContenido)}</div>
            </div>
            <div class="risk-item">
              <span class="risk-item-name">Ansiedad por Notificaciones</span>
              <div class="risk-item-badge">${getRiskBadge(r.riesgoAnsiedad)}</div>
            </div>
            <div class="risk-item">
              <span class="risk-item-name">Alteración de Identidad</span>
              <div class="risk-item-badge">${getRiskBadge(r.riesgoIdentidad)}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
  modal.style.display = 'flex';
};

window.closeDetailModal = function() {
  const modal = document.getElementById('detailModal');
  if (modal) modal.style.display = 'none';
};

window.exportAdminCSV = function() {
  if (!adminRecordsCache.length) {
    alert("No hay registros para exportar.");
    return;
  }
  const headers = ["ID", "Fecha", "Asesor", "Padre_Madre", "Celular", "Hijo", "Edad", "Importancia_1_10", "Prioridad_Tech", "Comportamiento", "Horas_Pantalla", "Plataformas", "Riesgo_Aislamiento", "Riesgo_Contenido", "Riesgo_Ansiedad", "Riesgo_Identidad"];
  
  const csvRows = [headers.join(",")];
  adminRecordsCache.forEach(r => {
    const dateFormatted = formatTimestamp(r.createdAt).replace(/,/g, '');
    const plats = (Array.isArray(r.plataformas) ? r.plataformas.join("; ") : (r.plataformas || '')).replace(/"/g, '""');
    const comp = (r.comportamiento || '').replace(/"/g, '""');
    
    const row = [
      `"${r.id}"`,
      `"${dateFormatted}"`,
      `"${(r.asesor || '').replace(/"/g, '""')}"`,
      `"${(r.nombrePadres || '').replace(/"/g, '""')}"`,
      `"${(r.celular || '').replace(/"/g, '""')}"`,
      `"${(r.nombreHijo || '').replace(/"/g, '""')}"`,
      `"${r.edadHijo || ''}"`,
      `"${r.importancia1_10 || ''}"`,
      `"${r.prioridadTech || ''}"`,
      `"${comp}"`,
      `"${r.horasPantalla || ''}"`,
      `"${plats}"`,
      `"${r.riesgoAislamiento || ''}"`,
      `"${r.riesgoContenido || ''}"`,
      `"${r.riesgoAnsiedad || ''}"`,
      `"${r.riesgoIdentidad || ''}"`
    ];
    csvRows.push(row.join(","));
  });

  const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `diagnosticos_zentryos_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.deleteRecord = async function(id) {
  if (confirm('¿Seguro que deseas eliminar este registro de diagnóstico?')) {
    try {
      await deleteDoc(doc(db, "bienestar_diagnostics", id));
      adminRecordsCache = adminRecordsCache.filter(r => r.id !== id);
      renderAdminRows(adminRecordsCache);
      const countEl = document.getElementById('adminTotalCount');
      if (countEl) countEl.innerText = `${adminRecordsCache.length} registros`;
    } catch(e) {
      alert('Error al eliminar: ' + e.message);
    }
  }
};

document.addEventListener('click', (e) => {
  if(e.target && e.target.id === 'openAdminBtn') {
    openAdminModal();
  }
});

window.renderAdminRows = renderAdminRows;
window.formatTimestamp = formatTimestamp;
