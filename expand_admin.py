import sys

with open('bienestar/src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# We will replace the entire "--- Admin Panel Logic ---" section down to the end of the file.
admin_logic_start = content.find('// --- Admin Panel Logic ---')
if admin_logic_start != -1:
    content_before = content[:admin_logic_start]
    
    new_admin_logic = """// --- Admin Panel Logic ---
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
                <th style="position: sticky; right: 0; background: rgba(25,25,35,0.95);">Acciones</th>
              </tr>
            </thead>
            <tbody id="adminTableBody">
              <tr><td colspan="15">Cargando datos...</td></tr>
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
          <td style="position: sticky; right: 0; background: rgba(35,35,45,1); display: flex; gap: 8px;">
            <button class="admin-action-btn admin-edit-btn" onclick="toggleEdit('${docSnap.id}')" title="Editar">✏️</button>
            <button class="admin-action-btn admin-delete-btn" onclick="deleteRecord('${docSnap.id}')" title="Eliminar">🗑️</button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html || '<tr><td colspan="15">No hay registros</td></tr>';
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="15" style="color:red">Error al cargar datos: ${e.message}</td></tr>`;
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
"""
    
    with open('bienestar/src/main.js', 'w', encoding='utf-8') as f:
        f.write(content_before + new_admin_logic)
    print("Updated admin logic in main.js")
else:
    print("Could not find admin logic section")
