import './style.css'
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

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

function saveStepData(num) {
  if(num === 1) {
    state.asesor = document.getElementById('asesor').value;
    state.nombrePadres = document.getElementById('nombrePadres').value;
    state.celular = document.getElementById('celular').value;
    state.nombreHijo = document.getElementById('nombreHijo').value;
    state.edadHijo = document.getElementById('edadHijo').value;
  }
  if(num === 2) state.importancia1_10 = document.getElementById('importancia1_10').value;
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
  // 1. Limpiar el estado interno
  state.asesor = ''; state.nombrePadres = ''; state.celular = ''; state.nombreHijo = ''; state.edadHijo = '';
  state.importancia1_10 = 10; state.prioridadTech = ''; state.comportamiento = '';
  state.plataformas = []; state.horasPantalla = 4;
  state.riesgoAislamiento = ''; state.riesgoContenido = ''; state.riesgoAnsiedad = ''; state.riesgoIdentidad = '';

  // 2. Limpiar los inputs visuales
  document.getElementById('asesor').value = '';
  document.getElementById('nombrePadres').value = '';
  document.getElementById('celular').value = '';
  document.getElementById('nombreHijo').value = '';
  document.getElementById('edadHijo').value = '';
  
  // 3. Restaurar sliders y contadores a sus valores por defecto
  document.getElementById('importancia1_10').value = 10;
  document.getElementById('sliderVal').innerText = '10';
  document.getElementById('horasPantalla').innerText = '4';

  // 4. Quitar la selección visual de todos los botones y tarjetas
  document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

  // 5. Restaurar la vista de carga/éxito
  document.getElementById('successState').style.display = 'none';
  document.getElementById('loadingState').style.display = 'flex';

  // 6. Restaurar la barra de progreso
  const bar = document.getElementById('progressBar');
  const wrapper = document.getElementById('progressWrapper');
  if (bar) bar.style.width = '25%';
  if (wrapper) wrapper.style.display = 'block';

  // 7. Volver al Paso 1
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
    step.classList.remove('exit');
  });
  document.getElementById('step-1').classList.add('active');
}

// Bind functions to window
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

// --- Admin Panel Logic ---
window.openAdminModal = async function() {
  let overlay = document.getElementById('adminModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'adminModal';
    overlay.className = 'admin-modal-overlay';
    overlay.innerHTML = `
      <div class="admin-modal-content">
        <div class="admin-modal-header">
          <h2 style="margin: 0; font-size: 1.4rem; color: #D6C8FA;">Registros de Diagnóstico • ZentryOS</h2>
          <button class="admin-close-btn" onclick="closeAdminModal()">×</button>
        </div>
        <div class="admin-modal-body" style="overflow-x: auto;">
          <table class="admin-table" style="min-width: 1500px;">
            <thead>
              <tr>
                <th>Asesor</th>
                <th>Padre/Madre</th>
                <th>Celular</th>
                <th>Hijo/a</th>
                <th>Edad</th>
                <th>Importancia (1-10)</th>
                <th>Prioridad Tech</th>
                <th>Comportamiento</th>
                <th>Plataformas</th>
                <th>Horas Pantalla</th>
                <th>R. Aislamiento</th>
                <th>R. Contenido</th>
                <th>R. Ansiedad</th>
                <th>R. Identidad</th>
                <th style="position: sticky; right: 0; background: rgba(28, 20, 48, 0.98);">Acciones</th>
              </tr>
            </thead>
            <tbody id="adminTableBody">
              <tr><td colspan="15">Cargando registros...</td></tr>
            </tbody>
          </table>
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
  try {
    const querySnapshot = await getDocs(collection(db, "bienestar_diagnostics"));
    let html = '';
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const plats = Array.isArray(data.plataformas) ? data.plataformas.join(', ') : (data.plataformas || '');
      html += `
        <tr id="row-${docSnap.id}">
          <td><input type="text" name="asesor" class="edit-input" value="${data.asesor || ''}" disabled /></td>
          <td><input type="text" name="nombrePadres" class="edit-input" value="${data.nombrePadres || ''}" disabled /></td>
          <td><input type="text" name="celular" class="edit-input" value="${data.celular || ''}" disabled /></td>
          <td><input type="text" name="nombreHijo" class="edit-input" value="${data.nombreHijo || ''}" disabled /></td>
          <td><input type="text" name="edadHijo" class="edit-input" value="${data.edadHijo || ''}" disabled /></td>
          <td><input type="text" name="importancia1_10" class="edit-input" value="${data.importancia1_10 || ''}" disabled /></td>
          <td><input type="text" name="prioridadTech" class="edit-input" value="${data.prioridadTech || ''}" disabled /></td>
          <td><input type="text" name="comportamiento" class="edit-input" value="${data.comportamiento || ''}" disabled /></td>
          <td><input type="text" name="plataformas" class="edit-input" value="${plats}" disabled /></td>
          <td><input type="text" name="horasPantalla" class="edit-input" value="${data.horasPantalla || ''}" disabled /></td>
          <td><input type="text" name="riesgoAislamiento" class="edit-input" value="${data.riesgoAislamiento || ''}" disabled /></td>
          <td><input type="text" name="riesgoContenido" class="edit-input" value="${data.riesgoContenido || ''}" disabled /></td>
          <td><input type="text" name="riesgoAnsiedad" class="edit-input" value="${data.riesgoAnsiedad || ''}" disabled /></td>
          <td><input type="text" name="riesgoIdentidad" class="edit-input" value="${data.riesgoIdentidad || ''}" disabled /></td>
          <td style="position: sticky; right: 0; background: rgba(38, 27, 64, 0.98); display: flex; gap: 8px;">
            <button class="admin-action-btn admin-edit-btn" onclick="toggleEdit('${docSnap.id}')" title="Editar">✏️</button>
            <button class="admin-action-btn admin-delete-btn" onclick="deleteRecord('${docSnap.id}')" title="Eliminar">🗑️</button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html || '<tr><td colspan="15">No hay registros</td></tr>';
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="15" style="color: #EF4444;">Error al cargar datos: ${e.message}</td></tr>`;
  }
};

window.toggleEdit = async function(id) {
  const row = document.getElementById('row-' + id);
  const isEditing = row.classList.toggle('editing');
  const inputs = row.querySelectorAll('.edit-input');
  const editBtn = row.querySelector('.admin-edit-btn');
  
  if (isEditing) {
    inputs.forEach(input => input.disabled = false);
    editBtn.innerText = '💾';
    editBtn.title = 'Guardar';
  } else {
    inputs.forEach(input => input.disabled = true);
    editBtn.innerText = '⏳';
    
    // Save to Firestore
    try {
      const updates = {};
      inputs.forEach(input => {
        if(input.name === 'plataformas') {
          updates[input.name] = input.value.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          updates[input.name] = input.value;
        }
      });
      await updateDoc(doc(db, "bienestar_diagnostics", id), updates);
      editBtn.innerText = '✏️';
      editBtn.title = 'Editar';
    } catch(e) {
      alert('Error guardando: ' + e.message);
      editBtn.innerText = '💾';
      row.classList.add('editing');
      inputs.forEach(input => input.disabled = false);
    }
  }
};

window.deleteRecord = async function(id) {
  if (confirm('¿Seguro que deseas eliminar este registro?')) {
    try {
      await deleteDoc(doc(db, "bienestar_diagnostics", id));
      document.getElementById('row-' + id).remove();
    } catch(e) {
      alert('Error eliminando: ' + e.message);
    }
  }
};

window.updateRecord = async function(id, field, value) {
  try {
    const ref = doc(db, "bienestar_diagnostics", id);
    await updateDoc(ref, { [field]: value });
  } catch(e) {
    alert('Error editando: ' + e.message);
  }
};

document.addEventListener('click', (e) => {
  if(e.target && e.target.id === 'openAdminBtn') {
    openAdminModal();
  }
});

window.updateRecord = updateRecord;
window.deleteRecord = deleteRecord;
window.closeAdminModal = closeAdminModal;
window.toggleEdit = toggleEdit;
