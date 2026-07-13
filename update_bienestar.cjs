const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, 'bienestar/src/main.js');
let content = fs.readFileSync(mainJsPath, 'utf8');

// 1. Ensure imports
if (!content.includes("import { db } from './firebase.js';")) {
  content = content.replace("import './style.css'", "import './style.css'\nimport { db } from './firebase.js';\nimport { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';");
} else if (!content.includes("getDocs")) {
  // Update imports to include all we need
  content = content.replace("import { collection, addDoc, serverTimestamp } from 'firebase/firestore';", "import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';");
}

// 2. Ensure submitData is async and using Firestore
if (content.includes('// MOCK SUBMIT')) {
  const submitDataOld = `function submitData() {
  if(validateStep(4)) {
    showStep(5, 'next');
    // MOCK SUBMIT
    console.log("Submitting to backend (mock):", state);
    setTimeout(onSuccess, 1500);
  }
}`;
  const submitDataNew = `async function submitData() {
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
}`;
  content = content.replace(submitDataOld, submitDataNew);
}

// 3. Admin logic
const adminLogic = `
// --- Admin Panel Logic ---
window.openAdminModal = async function() {
  let overlay = document.getElementById('adminModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'adminModal';
    overlay.className = 'admin-modal-overlay';
    overlay.innerHTML = \`
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
    \`;
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
      html += \`
        <tr id="row-\${docSnap.id}">
          <td><input type="text" value="\${data.asesor || ''}" onchange="updateRecord('\${docSnap.id}', 'asesor', this.value)" /></td>
          <td>\${data.nombrePadres || ''}</td>
          <td>\${data.celular || ''}</td>
          <td>\${data.nombreHijo || ''}</td>
          <td>\${data.edadHijo || ''}</td>
          <td>
            <button class="admin-action-btn admin-delete-btn" onclick="deleteRecord('\${docSnap.id}')">🗑️</button>
          </td>
        </tr>
      \`;
    });
    tbody.innerHTML = html || '<tr><td colspan="6">No hay registros</td></tr>';
  } catch(e) {
    tbody.innerHTML = \`<tr><td colspan="6" style="color:red">Error al cargar datos: \${e.message}</td></tr>\`;
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
`;

if (!content.includes('openAdminModal')) {
  content += adminLogic;
}

fs.writeFileSync(mainJsPath, content);
console.log('Successfully updated bienestar main.js');
