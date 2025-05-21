import axiosInstance from "../Config/AxiosConfig";


export const createProject = async () => {
    try{
        const response = await axiosInstance.post("api/v1/projects");
        console.log("Project created successfully:", response.data);
        return response.data;
    }catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
};

export const getProjectTree = async (projectId) => {
    try{
        const response = await axiosInstance.get(`api/v1/projects/${projectId}/tree`);
        // console.log("Project tree fetched successfully:", response.data);
        return response.data;
    }catch (error) {
        console.error("Error fetching project tree:", error);
        throw error;
    }
}