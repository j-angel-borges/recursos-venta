import './style.css';

const state = {
  id: '',
  nivelPreocupacion: 5, conocimientoDano: '', edadHijos: '', 
  preguntaCondicional: '', respuestaCondicional: '',
  interesSolucion: '', nombreMadre: '', celular: '', distrito: '', 
  observaciones: '', lastBranch: 4
};

function showStep(num) {
  document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
  document.getElementById(`step-${num}`).classList.add('active');
}

function nextStep(current, target = current + 1) {
  if(current === 0) { showStep(1); return; }
  if(current === 1) { state.nivelPreocupacion = document.getElementById('nivelPreocupacion').value; showStep(2); return; }
  if(current === 2) { if(!state.conocimientoDano) { alert("Seleccione una opción"); return; } showStep(3); return; }
  
  if(current === 4 || current === 5 || current === 6) {
    if(!state.respuestaCondicional) { alert("Seleccione una opción"); return; }
    showStep(7); return;
  }
  
  if(current === 7) { if(!state.interesSolucion) { alert("Seleccione una opción"); return; } showStep(8); return; }
  
  if(current === 8) {
    state.nombreMadre = document.getElementById('nombreMadre').value;
    state.celular = document.getElementById('celular').value;
    state.distrito = document.getElementById('distrito').value;
    if(!state.nombreMadre || !state.celular) { alert("Complete los datos requeridos"); return; }
    
    submitData();
    showStep(9);
    return;
  }
  
  showStep(target);
}

function prevStep(current, target = current - 1) {
  showStep(target);
}

function selectBtnGroup(btn, groupName) {
  const parent = btn.parentElement;
  parent.querySelectorAll('.btn-select').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state[groupName] = btn.getAttribute('data-val');
}

function selectOptionGroup(card, groupName, targetStep) {
  const parent = card.parentElement;
  parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  state[groupName] = card.getAttribute('data-val');
  
  // Set conditional question context
  if(targetStep === 4) state.preguntaCondicional = "Desconexión Familiar (Mayores)";
  if(targetStep === 5) state.preguntaCondicional = "Desarrollo Tecnológico (Menores)";
  if(targetStep === 6) state.preguntaCondicional = "Educación Tradicional (Ambas)";
  
  state.lastBranch = targetStep;
  setTimeout(() => showStep(targetStep), 300);
}

function submitData() {
  document.getElementById('successState').style.display = 'none';
  document.getElementById('loadingState').style.display = 'flex';
  
  console.log("Mock enviando datos al backend:", state);
  // Simulación de petición fetch al backend
  setTimeout(() => {
    onSuccess();
  }, 1500);
}

function onSuccess() {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('successState').style.display = 'block';
}

function onError(error) {
  alert("Error: " + error);
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('successState').style.display = 'block';
}

function finishAndReload() {
  state.observaciones = document.getElementById('observaciones').value;
  console.log("Mock guardando observaciones:", state.observaciones);
  location.reload();
}

window.state = state;
window.showStep = showStep;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.selectBtnGroup = selectBtnGroup;
window.selectOptionGroup = selectOptionGroup;
window.submitData = submitData;
window.onSuccess = onSuccess;
window.onError = onError;
window.finishAndReload = finishAndReload;
