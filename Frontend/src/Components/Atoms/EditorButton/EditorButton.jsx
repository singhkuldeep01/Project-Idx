import React from 'react';
import { X } from 'lucide-react';

function EditorButton({ fileName, isActive, onClick, onClose }) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-2 px-4 py-[6px] font-mono text-sm cursor-pointer select-none
        border-r border-[#2e2e2e] transition-all duration-200
        ${
          isActive
            ? 'bg-[#1e1e1e] text-white border-t border-l border-[#3c3c3c] rounded-t-md shadow-[inset_0_-1px_0_0_#007acc]'
            : 'bg-[#2d2d2d] text-gray-400 hover:bg-[#373737] hover:text-white'
        }`}
    >
      <span className="truncate max-w-[140px]">{fileName}</span>
      <X
        size={14}
        className="invisible group-hover:visible text-gray-400 hover:text-white transition-all duration-150"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
    </div>
  );
}

export default EditorButton;
