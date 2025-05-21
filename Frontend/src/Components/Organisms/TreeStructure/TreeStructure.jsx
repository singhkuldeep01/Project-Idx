import React, { useEffect } from 'react';
import { useTreeStructureStore } from '../../../Store/treeStructureStore';
import { useParams } from 'react-router-dom';
import Tree from '../../Molecules/Tree';
import { useEditorSocketStore } from '../../../Store/editorSocketStore';

function TreeStructure() {
  const { projectId } = useParams();
  const { treeStructure, setTreeStructure, setProjectId } = useTreeStructureStore();
  const { editorSocket } = useEditorSocketStore();

  // Set project ID and fetch initial tree structure
  useEffect(() => {
    if (!projectId) return;
    setProjectId(projectId);
    setTreeStructure(); // Make sure this fetches fresh data
  }, [projectId]);

  // Listen for delete success and refresh tree
  useEffect(() => {
    if (!editorSocket) return;

    const handleDeleteSuccess = (data) => {
      setTreeStructure(); // Refetch tree after deletion
    };

    editorSocket.on('deleteFileSuccess', handleDeleteSuccess);

    return () => {
      editorSocket.off('deleteFileSuccess', handleDeleteSuccess);
    };
  }, [editorSocket]);

  return (
    <div style={{ padding: '10px', fontFamily: 'Arial, sans-serif' }}>
      {treeStructure ? (
        treeStructure.children?.map((child) => (
          <Tree key={child.path} folder={child} />
        ))
      ) : (
        <div style={{ fontSize: '16px', color: '#7f8c8d', fontStyle: 'italic' }}>
          Loading tree structure...
        </div>
      )}
    </div>
  );
}

export default TreeStructure;
