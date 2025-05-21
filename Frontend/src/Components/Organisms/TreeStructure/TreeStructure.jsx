import React, { useEffect } from 'react';
import { useTreeStructureStore } from '../../../Store/treeStructureStore';
import { useParams } from 'react-router-dom';
import Tree from '../../Molecules/Tree';

function TreeStructure() {
  const projectIdParams = useParams().projectId;
  const { treeStructure, setTreeStructure, projectId, setProjectId } = useTreeStructureStore();

  useEffect(() => {
    setProjectId(projectIdParams);
    if (treeStructure == null) setTreeStructure();
  }, [treeStructure, projectId, setTreeStructure]);

  return (
    <div style={{ padding: '10px', fontFamily: 'Arial, sans-serif' }}>
      {treeStructure ? (
        treeStructure.children.map((child) => (
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
