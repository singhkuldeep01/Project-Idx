import { useQuery } from "@tanstack/react-query";
import { getProjectTree } from "../../../Apis/project";

export const useProjectTree = (projectId) => {
    const { data, isLoading, error ,isError } = useQuery({
        queryKey: ['projectTree', projectId],
        queryFn: () => getProjectTree(projectId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!projectId, // Only run the query if projectId is available
    });

    return { data, isLoading, error , isError };
}