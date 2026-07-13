const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'bienestar/src/style.css');

const css = `
/* --- Admin Panel --- */
.top-right {
  position: absolute;
  top: 16px;
  right: 16px;
}
.admin-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.2s ease;
  z-index: 100;
}
.admin-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}
.admin-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.admin-modal-content {
  background: rgba(25, 25, 35, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 90%;
  max-width: 1000px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  overflow: hidden;
  color: white;
  font-family: 'Inter', sans-serif;
}
.admin-modal-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,0.2);
}
.admin-close-btn {
  background: none; border: none; color: white; font-size: 1.8rem; cursor: pointer;
  line-height: 1; padding: 0 8px; opacity: 0.7; transition: opacity 0.2s;
}
.admin-close-btn:hover { opacity: 1; }
.admin-modal-body {
  padding: 24px;
  overflow-y: auto;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}
.admin-table th, .admin-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.admin-table th {
  color: rgba(255,255,255,0.5);
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}
.admin-table tbody tr {
  transition: background 0.2s;
}
.admin-table tbody tr:hover {
  background: rgba(255,255,255,0.04);
}
.admin-table input {
  background: transparent;
  border: 1px solid transparent;
  color: white;
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.admin-table input:focus {
  border: 1px solid rgba(255,255,255,0.3);
  outline: none;
  background: rgba(0,0,0,0.2);
}
.admin-action-btn {
  background: none; border: none; cursor: pointer; padding: 8px; color: #aaa;
  border-radius: 4px; transition: all 0.2s;
}
.admin-action-btn:hover { color: white; background: rgba(255,255,255,0.1); }
.admin-delete-btn:hover { color: #ff4d4d; background: rgba(255,77,77,0.1); }
`;

let content = fs.readFileSync(cssPath, 'utf8');
if (!content.includes('admin-modal-overlay')) {
  fs.appendFileSync(cssPath, css);
  console.log('Appended to style.css');
} else {
  console.log('Styles already exist.');
}
