import './style.css'
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
