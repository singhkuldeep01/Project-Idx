import React, { useState, useEffect, useRef } from 'react';

import { AiOutlineRight, AiOutlineDown } from 'react-icons/ai';
import getFileIcon from '../Atoms/FileIcon/FileIcon';
import { useEditorSocketStore } from '../../Store/editorSocketStore';
import FileMenu from '../Atoms/fileMenu';
import { useTreeStructureStore } from '../../Store/treeStructureStore';



function Tree({ folder }) {
  const { editorSocket } = useEditorSocketStore();
  const [isOpen, setIsOpen] = useState(false);

  const {setTreeStructure} = useTreeStructureStore();

  // State to show/hide context menu and store its position
  const [menuPos, setMenuPos] = useState(null);
  const menuRef = useRef();

  const getFileExtension = (fileName) => fileName.split('.').pop();

  const handleFolderClick = (e) => {
    e.stopPropagation();
    if (folder.type === 'directory') {
      setIsOpen(!isOpen);
    }
  };

  const handleFileClick = (e) => {
    e.stopPropagation();
    editorSocket.emit('readFile', {
      path: folder.path,
      name: folder.name
    });
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  // Close menu on clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuPos(null);
      }
    }
    if (menuPos) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuPos]);

  const closeMenu = () => {
    setMenuPos(null);
  };

  const handleRename = () => {
    closeMenu();
    console.log('Rename', folder.name);
    // Your rename logic here
  };

  const handleDelete = () => {
    closeMenu();
    console.log('Delete', folder.name);
    editorSocket.emit('deleteFile', folder.path);
    editorSocket.on('deleteFileSuccess' , (data)=>{
      console.log(data.message);
      setTreeStructure();
    });
  };

  return (
    <div className="ml-4 p-1">
      {folder.type === 'directory' ? (
        <div
          onClick={handleFolderClick}
          className="flex items-center gap-2 cursor-pointer mt-2"
        >
          <span className="text-gray-500">
            {isOpen ? <AiOutlineDown size={16} /> : <AiOutlineRight size={16} />}
          </span>
          <span className="text-blue-600">{isOpen ? '📂' : '📁'}</span>
          <span className="text-gray-200 font-bold">{folder.name}</span>
        </div>
      ) : (
        <div
          onClick={handleFileClick}
          onContextMenu={handleRightClick}
          className="flex items-center gap-2 cursor-pointer ml-5 relative"
        >
          <span className="w-[1.5ch]" />
          {getFileIcon(getFileExtension(folder.name))}
          <span className="text-gray-200 font-bold">{folder.name}</span>

          {menuPos && (
            <FileMenu
              ref={menuRef}
              style={{
                position: 'fixed', // fixed to viewport to work with clientX/Y
                top: menuPos.y,
                left: menuPos.x,
                zIndex: 1000,
              }}
              onRename={handleRename}
              onDelete={handleDelete}
              onClose={closeMenu}
            />
          )}
        </div>
      )}

      {isOpen && folder.children?.length > 0 && (
        <div>
          {folder.children.map((child) => (
            <Tree key={child.path} folder={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Tree;
