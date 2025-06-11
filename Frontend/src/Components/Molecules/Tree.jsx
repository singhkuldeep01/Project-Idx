import { useState, useEffect, useRef } from 'react';
import { AiOutlineRight, AiOutlineDown } from 'react-icons/ai';
import getFileIcon from '../Atoms/FileIcon/FileIcon';
import { useEditorSocketStore } from '../../Store/editorSocketStore';
import FileMenu from '../Atoms/fileMenu';
import FileEditModal from '../Atoms/fileEditModal';
// import FileEditModal from '../Atoms/FileEditModal'
// ;

FileEditModal

function Tree({ folder }) {
  const { editorSocket } = useEditorSocketStore();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState(null);
  const [modalProps, setModalProps] = useState(null);
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
    console.log("hello");
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuPos(null);
      }
    }
    if (menuPos) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuPos]);

  const closeMenu = () => setMenuPos(null);

  const handleRename = () => {
  closeMenu();
  setModalProps({
    isOpen: true,
    defaultFileName: folder.name,
    placeholder: `Enter new ${folder.type} name...`,
    title: `Rename ${folder.type}`,
    onSubmit: (newName) => {
      const pathParts = folder.path.split('/');
      pathParts[pathParts.length - 1] = newName;
      const newPath = pathParts.join('/');

      editorSocket.emit('renameFileFolder', folder.path , newPath);

      setModalProps(null);
    },
    onCancel: () => setModalProps(null),
  });
};


  const handleDeleteFile = () => {
    closeMenu();
    const event = folder.type === 'directory' ? 'deleteFolder' : 'deleteFile';
    editorSocket.emit(event, folder.path);
  };

  const handleCreate = (type) => {
  closeMenu();
  setModalProps({
    isOpen: true,
    placeholder: `Enter ${type} name...`,
    title: `Create ${type}`,
    onSubmit: (name) => {
      const event = type === 'file' ? 'createFile' : 'createFolder';
      const newPath = `${folder.path}/${name}`;
      editorSocket.emit(event, "" , newPath);
      setModalProps(null);
    },
    onCancel: () => setModalProps(null),
  });
};


  return (
    <div className="ml-4 p-1">
      {folder.type === 'directory' ? (
        <div
          onClick={handleFolderClick}
          onContextMenu={handleRightClick}
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
          className="flex items-center gap-2 cursor-pointer ml-5"
        >
          <span className="w-[1.5ch]" />
          {getFileIcon(getFileExtension(folder.name))}
          <span className="text-gray-200 font-bold">{folder.name}</span>
        </div>
      )}

      {menuPos && (
        <FileMenu
          ref={menuRef}
          style={{
            position: 'fixed',
            top: menuPos.y,
            left: menuPos.x,
            zIndex: 1000,
          }}
          onRename={handleRename}
          onDelete={handleDeleteFile}
          onClose={closeMenu}
          type={folder.type}
          onCreateNewFile={() => handleCreate('file')}
          onCreateNewFolder={() => handleCreate('folder')}
        />
      )}

      {modalProps && <FileEditModal {...modalProps} />}

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
