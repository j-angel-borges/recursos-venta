import sys

with open('bienestar/src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_fn = """function submitData() {
  if(validateStep(4)) {
    showStep(5, 'next');
    // MOCK SUBMIT
    console.log("Submitting to backend (mock):", state);
    setTimeout(onSuccess, 1500);
  }
}"""

# Handle Windows or Unix line endings
old_fn = old_fn.replace('\n', '\r\n')
if old_fn not in content:
    old_fn = old_fn.replace('\r\n', '\n')

new_fn = """async function submitData() {
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
}"""

content = content.replace(old_fn, new_fn)

with open('bienestar/src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement done")
