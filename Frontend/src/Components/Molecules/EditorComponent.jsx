import React from 'react';
import EditorButton from '../Atoms/EditorButton/EditorButton';
import { Plus } from 'lucide-react';
import { useActiveFileTabStore } from '../../Store/activeFileTabStore';

function EditorComponent() {
  const {
    openTabs,
    activeFileTab,
    setActiveFileTab,
    closeTab,
  } = useActiveFileTabStore();

  const handleAddTab = () => {
    const newFile = {
      path: `newFile${openTabs.length + 1}.js`,
      name: `newFile${openTabs.length + 1}.js`,
      extension: 'js',
      content: '',
    };
    setActiveFileTab(newFile.path, newFile.name, newFile.extension, newFile.content);
  };

  return (
    <div className="flex items-center bg-[#1e1e1e] border-b border-[#333] overflow-x-auto px-2 py-1 space-x-1">
      {openTabs.map((tab) => (
        <EditorButton
          key={tab.path}
          fileName={tab.name}
          isActive={tab.path === activeFileTab?.path}
          onClick={() =>
            setActiveFileTab(tab.path, tab.name, tab.extension, tab.content)
          }
          onClose={() => closeTab(tab.path)}
          className={`${
            tab.path === activeFileTab?.path
              ? 'bg-blue-600 text-white border-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          } px-3 py-1 rounded-md transition-all duration-150`}
        />
      ))}
      <button
        onClick={handleAddTab}
        className="text-gray-400 hover:text-white px-2 py-[6px] rounded-md transition-all duration-150"
        title="New File"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

export default EditorComponent;
