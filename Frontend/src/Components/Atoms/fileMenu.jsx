import React, { useEffect } from 'react';
import { IoCloseSharp } from 'react-icons/io5'; // cross icon from react-icons

function FileMenu({ style, onRename, onDelete, onClose }) {
  // Close menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // If click outside the menu div, close menu
      if (!e.target.closest('.file-menu')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div
      className="file-menu absolute bg-[#1e1e1e] border border-[#3c3c3c] shadow-lg rounded w-48 py-1 text-gray-200 z-50"
      style={style}
    >
      {/* Close icon top right */}
      <div className="flex justify-end pr-2 pt-1 cursor-pointer" onClick={onClose}>
        <IoCloseSharp className="text-gray-400 hover:text-white" size={18} />
      </div>

      {/* Menu options */}
      <div
        className="px-4 py-2 cursor-pointer hover:bg-[#333333] hover:text-white"
        onClick={() => {
          onRename();
          onClose();
        }}
      >
        Rename
      </div>
      <div
        className="px-4 py-2 cursor-pointer text-red-500 hover:bg-[#5a1a1a] hover:text-red-400"
        onClick={() => {
          onDelete();
          onClose();
        }}
      >
        Delete
      </div>
    </div>
  );
}

export default FileMenu;
