import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import draculaTheme from '../Drakula.json';
import EditorComponent from '../Components/Molecules/EditorComponent';
import { useEditorSocketStore } from '../Store/editorSocketStore';
import { useActiveFileTabStore } from '../Store/activeFileTabStore';
import { io } from 'socket.io-client';
import TreeStructure from '../Components/Organisms/TreeStructure/TreeStructure';
import { getLanguage } from '../utils/getLanguage';
import BrowserTerminal from '../Components/Molecules/BrowserTerminal';

const { Sider } = Layout;

function ProjectPlayground() {
  const editorRef = useRef(null);
  const { projectId } = useParams();
  const { editorSocket, setEditorSocket } = useEditorSocketStore();
  const [collapsed, setCollapsed] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [showTerminal, setShowTerminal] = useState(true);

  const {
    activeFileTab,
    updateActiveFileContent
  } = useActiveFileTabStore();

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme('dracula', draculaTheme);
    monaco.editor.setTheme('dracula');
  };

  useEffect(() => {
    if (editorRef.current && activeFileTab?.content !== undefined) {
      const current = editorRef.current.getValue();
      if (current !== activeFileTab.content) {
        editorRef.current.setValue(activeFileTab.content);
      }
    }

    if (activeFileTab?.extension) {
      setLanguage(getLanguage(activeFileTab.extension));
    }
  }, [activeFileTab?.path]);

  useEffect(() => {
    const editorSocketConn = io(
      `http://localhost:3000/editor?projectId=${projectId}`,
      {
        transports: ['websocket'],
        autoConnect: true
      }
    );
    setEditorSocket(editorSocketConn);
    return () => {
      editorSocketConn.disconnect();
    };
  }, [projectId]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const debounceTimer = useRef(null);

  const handleEditorChange = (value) => {
    if (!activeFileTab?.path) return;

    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      editorSocket?.emit('writeFile', {
        path: activeFileTab.path,
        content: value,
        fileName: activeFileTab.name
      });
      updateActiveFileContent(value);
    }, 500);
  };

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);




  return (
    <Layout className="h-screen bg-[#1e1e1e] text-white overflow-hidden">
      <Sider
        width={300}
        collapsed={collapsed}
        onCollapse={toggleSidebar}
        collapsedWidth={50}
        collapsible
        trigger={null}
        className="bg-[#1e1e1e] border-r border-[#333] transition-all duration-300"
      >
        <Button
          type="primary"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{
            position: 'absolute',
            top: 16,
            left: collapsed ? '50%' : 16,
            transform: collapsed ? 'translateX(-50%)' : 'none',
            zIndex: 1
          }}
        />
        {!collapsed && <TreeStructure />}
      </Sider>

      <Layout className="flex flex-col bg-[#1e1e1e] w-full">
        {/* Tab Bar */}
        <div className="flex-shrink-0 border-b bg-[#1e1e1e]  border-[#333] flex items-center justify-between">
          <EditorComponent />
          <Button
            onClick={() => setShowTerminal(!showTerminal)}
            icon={<ConsoleSqlOutlined />}
            size="small"
            className="mr-2 my-2"
          >
            {showTerminal ? 'Hide Terminal' : 'Show Terminal'}
          </Button>
        </div>

        {/* Editor */}
        <div className="flex-grow overflow-hidden border-b border-[#333]">
          <Editor
            language={language}
            value={activeFileTab?.content || ''}
            theme="dracula"
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14
            }}
          />
        </div>

        {/* Terminal (Resizable and Toggleable) */}
        {showTerminal && (
          <>
            <div
              className="h-2  bg-[#444]"
            />
            <div
              className="flex-shrink-0 bg-black min-h-56"
            >
              <BrowserTerminal />
            </div>
          </>
        )}
      </Layout>
    </Layout>
  );
}

export default ProjectPlayground;
