import sys

with open('bienestar/src/style.css', 'a', encoding='utf-8') as f:
    f.write("""
/* Admin Expansion Styles */
.admin-modal-body {
  overflow-x: auto;
  max-width: 100%;
}
.admin-table {
  min-width: 1500px;
}
.edit-input {
  width: 100%;
  min-width: 100px;
  background: transparent;
  border: 1px solid transparent;
  color: #fff;
  padding: 6px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}
.edit-input:disabled {
  opacity: 1;
  color: #e2e8f0;
}
.editing .edit-input:not(:disabled) {
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.2);
}
.editing .edit-input:focus {
  border-color: #3b82f6;
  outline: none;
  background: rgba(0, 0, 0, 0.3);
}
.admin-table th, .admin-table td {
  white-space: nowrap;
}
""")
print("CSS appended.")
