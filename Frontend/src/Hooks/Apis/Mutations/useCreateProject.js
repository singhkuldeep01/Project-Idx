import {useMutation} from "@tanstack/react-query"
import { createProject } from "../../../Apis/project";

export const useCrateProject = ()=>{
    const {mutateAsync , isPending , isSuccess , error , data} = useMutation({
        mutationFn: createProject,
        onSuccess: (data) => {
            console.log("Project created successfully:", data);
        },
        onError: (error) => {
            console.error("Error creating project:", error);
        },
    });
    return {
        createProject: mutateAsync,
        isPending,
        isSuccess,
        error,
        data
        // projectId: data?.projectId, // Assuming the response contains projectId
    }
};