const fs = require('fs');
let content = fs.readFileSync('bienestar/src/main.js', 'utf8');

const oldFn = `function submitData() {
  if(validateStep(4)) {
    showStep(5, 'next');
    // MOCK SUBMIT
    console.log("Submitting to backend (mock):", state);
    setTimeout(onSuccess, 1500);
  }
}`;

const newFn = `async function submitData() {
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

if (content.includes('// MOCK SUBMIT')) {
  content = content.replace(oldFn, newFn);
  fs.writeFileSync('bienestar/src/main.js', content);
  console.log('Successfully updated submitData');
} else {
  console.log('MOCK SUBMIT not found, maybe already replaced?');
}
