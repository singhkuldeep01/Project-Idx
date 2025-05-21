import React, { useState } from 'react';
import { AiOutlineRight, AiOutlineDown } from 'react-icons/ai';
import getFileIcon from '../Atoms/FileIcon/FileIcon';
import { useEditorSocketStore } from '../../Store/editorSocketStore';
import { useActiveFileTabStore } from '../../Store/activeFileTabStore';

function Tree({ folder }) {
  const { editorSocket } = useEditorSocketStore();
  const [isOpen, setIsOpen] = useState(false);

  const getFileExtension = (fileName) => fileName.split('.').pop();

  const handleFolderClick = (e) => {
    e.stopPropagation(); // Prevent bubbling to parent folders
    if (folder.type === 'directory') {
      setIsOpen(!isOpen);
    }
  };

  const handleFileClick = (e) => {
    e.stopPropagation(); // Prevent bubbling
    editorSocket.emit('readFile', {
      path: folder.path,
      name: folder.name
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
          className="flex items-center gap-2 cursor-pointer ml-5"
        >
          <span className="w-[1.5ch]" />
          {getFileIcon(getFileExtension(folder.name))}
          <span className="text-gray-200 font-bold">{folder.name}</span>
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
