import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import draculaTheme from '../Drakula.json';
import EditorComponent from '../Components/Molecules/EditorComponent';
import { useEditorSocketStore } from '../Store/editorSocketStore';
import { useActiveFileTabStore } from '../Store/activeFileTabStore';
import { io } from 'socket.io-client';
import TreeStructure from '../Components/Organisms/TreeStructure/TreeStructure';
import { getLanguage } from '../utils/getLanguage';

const { Sider, Content } = Layout;

function ProjectPlayground() {
  const editorRef = useRef(null);
  const { projectId } = useParams();
  const { editorSocket, setEditorSocket } = useEditorSocketStore();
  const [collapsed, setCollapsed] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const {
    activeFileTab,
    setActiveFileTab,
    updateActiveFileContent
  } = useActiveFileTabStore();

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme('dracula', draculaTheme);
    monaco.editor.setTheme('dracula');
  };

  // ⚡ Update content in editor only when switching to a new file
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
  }, [activeFileTab?.path]); // react only to tab switch

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
    }, 500); // 2 seconds debounce
  };

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  return (
    <Layout className="min-h-screen bg-[#1e1e1e] text-white">
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
            zIndex: 1,
            padding: collapsed ? '6px' : '10px'
          }}
        />
        {!collapsed && <TreeStructure />}
      </Sider>

      <Layout style={{ backgroundColor: '#1e1e1e' }}>
        <Content className="flex flex-col p-0 overflow-hidden h-full">
          <div className="flex-shrink-0 mb-0 border-b border-[#333]">
            <EditorComponent />
          </div>

          <div className="flex-grow border-b border-[#333]">
            <Editor
              height="100vh"
              language={language}
              value={activeFileTab?.content || ''} // ✅ Use uncontrolled mode
              theme="dracula"
              onMount={handleEditorDidMount}
              onChange={handleEditorChange}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default ProjectPlayground;
