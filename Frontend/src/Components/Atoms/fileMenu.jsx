import React, { useEffect } from 'react';

function FileMenu({ style, onRename, onDelete, onClose , type  , onCreateNewFile , onCreateNewFolder}) {
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
      className="file-menu absolute bg-[#1e1e1e] border border-[#3c3c3c] shadow-lg rounded-md w-48 py-1 text-gray-200 z-50"
      style={style}
    >

      {/* Menu options */}
      {(type === 'directory')?
      <>
        <div
        className="px-4 py-2 cursor-pointer text-white  hover:bg-[#333333] hover:text-white"
        onClick={() => {
          onClose();
            onCreateNewFile();
        }}
      >
        Create New File
      </div>
      <div
        className="px-4 py-2 cursor-pointer text-white  hover:bg-[#333333] hover:text-white"
        onClick={() => {
          onClose();
          onCreateNewFolder();
        }}
      >
        Create New Folder
      </div>
      </> : null}
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
