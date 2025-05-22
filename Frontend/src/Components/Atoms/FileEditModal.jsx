import React, { useState, useEffect } from 'react';

function FileEditModal({
  isOpen,
  defaultFileName = '',
  placeholder = 'Enter name...',
  onSubmit,
  onCancel,
  title = 'Create',
}) {
  const [name, setName] = useState(defaultFileName);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(defaultFileName);
      setError('');
    }
  }, [isOpen, defaultFileName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    onSubmit(name.trim());
    setName('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
      <div className="w-full max-w-sm p-4 bg-[#1e1e1e] border border-[#333] rounded text-sm text-gray-200 shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-white mb-1">{title}</h2>

          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            autoFocus
            placeholder={placeholder}
            className="px-3 py-2 bg-[#2d2d2d] text-white border border-[#444] rounded outline-none focus:ring-2 focus:ring-[#007acc]"
          />

          {error && <span className="text-red-400 text-xs">{error}</span>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onCancel();
                setName('');
                setError('');
              }}
              className="px-3 py-1 text-sm bg-[#2e2e2e] hover:bg-[#3a3a3a] border border-[#444] rounded text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-[#0e639c] hover:bg-[#1177bb] border border-[#007acc] rounded text-white"
            >
              {defaultFileName ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FileEditModal;
