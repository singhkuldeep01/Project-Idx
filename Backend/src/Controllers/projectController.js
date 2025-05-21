import { createProjectService, getProjectTree } from "../Service/createProjectService.js";

export const createProjectController = async (req, res) => {
    const projectId = await createProjectService();
    res.status(200).json({ message: 'Project created successfully', projectId });
};

export const getProjectTreeController = async (req, res) => {
    const { projectId } = req.params;
    // console.log('Project ID:', projectId);
    const tree = await getProjectTree(projectId);
    res.status(200).json(tree);
    // res.status(200).json({ message: 'Project tree fetched successfully' });
}