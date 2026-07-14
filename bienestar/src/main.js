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
      if(!el.value) { el.style.borderColor = 'var(--danger)'; valid = false; }
      else { el.style.borderColor = 'var(--card-border)'; }
    });
    return valid;
  }
  if(num === 2) { if(!state.prioridadTech || !state.comportamiento) { alert("Responda todas las preguntas."); return false; } }
  if(num === 4) { if(!state.riesgoAislamiento || !state.riesgoContenido || !state.riesgoAnsiedad || !state.riesgoIdentidad) { alert("Califique todos los escenarios."); return false; } }
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

// NUEVA FUNCIÓN: Reinicia el formulario sin recargar la página (evita la pantalla blanca)
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

  // 6. Volver al Paso 1
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
          <h2 style="margin: 0; font-size: 1.5rem;">Registros de Bienestar</h2>
          <button class="admin-close-btn" onclick="closeAdminModal()">×</button>
        </div>
        <div class="admin-modal-body">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Asesor</th>
                <th>Padre/Madre</th>
                <th>Celular</th>
                <th>Hijo/a</th>
                <th>Edad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="adminTableBody">
              <tr><td colspan="6">Cargando datos...</td></tr>
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
      html += `
        <tr id="row-${docSnap.id}">
          <td><input type="text" value="${data.asesor || ''}" onchange="updateRecord('${docSnap.id}', 'asesor', this.value)" /></td>
          <td>${data.nombrePadres || ''}</td>
          <td>${data.celular || ''}</td>
          <td>${data.nombreHijo || ''}</td>
          <td>${data.edadHijo || ''}</td>
          <td>
            <button class="admin-action-btn admin-delete-btn" onclick="deleteRecord('${docSnap.id}')">🗑️</button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html || '<tr><td colspan="6">No hay registros</td></tr>';
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:red">Error al cargar datos: ${e.message}</td></tr>`;
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
