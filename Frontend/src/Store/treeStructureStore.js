import {create} from 'zustand';
import { QueryClient } from '@tanstack/react-query';
import { getProjectTree } from '../Apis/project';

export const useTreeStructureStore = create((set , get) => {

    const queryClinet = new QueryClient();
    return{
        projectId : null,
        setProjectId : (projectId)=>{
            set({projectId: projectId});
        },
        treeStructure : null,
        setTreeStructure : async ()=>{
            const projectId = get().projectId;
            if (!projectId) {
                console.error("Project ID is not set.");
                return;
            }
            const data = await queryClinet.fetchQuery({
                queryKey: ['projectTree', projectId],
                queryFn: () => getProjectTree(projectId),
                staleTime: 1000 * 60 * 5, // 5 minutes
                cacheTime: 1000 * 60 * 10, // 10 minutes
                enabled: !!projectId // Only run the query if projectId is available
            });
            set({treeStructure: data});
        }
    }
});