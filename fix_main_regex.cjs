const fs = require('fs');
let content = fs.readFileSync('bienestar/src/main.js', 'utf8');

const regex = /function submitData\(\) \{[\s\S]*?setTimeout\(onSuccess, 1500\);[\s\S]*?\}/;

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

if (regex.test(content)) {
  content = content.replace(regex, newFn);
  fs.writeFileSync('bienestar/src/main.js', content);
  console.log('Regex replace successful');
} else {
  console.log('Regex did not match');
}
