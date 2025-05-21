import { create } from 'zustand';
import { QueryClient } from '@tanstack/react-query';
import { getProjectTree } from '../Apis/project';

const queryClient = new QueryClient();

export const useTreeStructureStore = create((set, get) => ({
  projectId: null,
  setProjectId: (projectId) => {
    set({ projectId });
  },
  treeStructure: null,
  setTreeStructure: async () => {
    const projectId = get().projectId;
    if (!projectId) {
      console.error("Project ID is not set.");
      return;
    }
    const data = await queryClient.fetchQuery({
      queryKey: ['projectTree', projectId],
      queryFn: () => getProjectTree(projectId),
      stale: false, // force fresh fetch ignoring cache
    });
    set({ treeStructure: data });
  },
}));
