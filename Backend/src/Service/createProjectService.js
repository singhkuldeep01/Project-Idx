import fs from 'fs/promises';
import uuid from 'uuid4';
import dotenv from 'dotenv';
dotenv.config();
import { execPromise } from '../Utils/execUtility.js';
import directoryTree from 'directory-tree';
import path from 'path';

export const createProjectService = async () => {
    const projectId = uuid();
    const command = process.env.REACT_CODE;
    await fs.mkdir('./projects/'+projectId);
    const response = await execPromise(command, {
        cwd: `./projects/${projectId}`,
    });
    return projectId;
};

export const getProjectTree = async(projectId)=>{
    const projectPath = path.resolve('./projects', projectId);
    const tree = directoryTree(projectPath , {
        // extensions: /\.(js|jsx|ts|tsx|json|css|html|svg|env)$/,
        // exclude: /node_modules/,
        normalizePath: true,
        attributes: ['type', 'size', 'extension'],
    });
    return tree;
}