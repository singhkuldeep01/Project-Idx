import fs from 'fs/promises';

export const handleEditorEvent = (socket, editorNamespace) => {
    
    socket.on('writeFile', async ({path , content , fileName}) => {
        try{
            console.log('write file called');
            const response = await fs.writeFile(path, content);
            editorNamespace.emit('writeFileSuccess' , {
                message: 'File written successfully',
                response:content,
                path: path,
                name:fileName
            })

        }catch(err){
            console.error("Error writing file:", err);
            socket.emit('error', {
                message: 'Failed to write file', error: err 
            });
            return;
        }

    });

    socket.on('createFile', async ( fileData, path ) => {
    try {
        await fs.access(path);
        // If access succeeds, file already exists
        socket.emit('error', {
        message: 'File already exists',
        });
        return;
    } catch {
        // File does not exist, so proceed to create
        try {
        await fs.writeFile(path, fileData);
        editorNamespace.emit('createFileSuccess', {
            message: 'File created successfully',
            path,
        });
        } catch (err) {
        console.error("Error creating file:", err);
        socket.emit('error', {
            message: 'Failed to create file',
            error: err.message,
        });
        }
    }
    });


    socket.on('readFile' , async ({path , name}) => {
        console.log('read File called');
        try{
            const response = await fs.readFile(path, 'utf-8');
            socket.emit('readFileSuccess' , {
                message: 'File read successfully',
                data: response,
                path,
                name
            });
        }catch(err){
            socket.emit('error', {
                message: 'Failed to read file', error: err
            });
        } 
    });

    socket.on('deleteFile' , async ( path) => {
        try{
            await fs.unlink(path);
            editorNamespace.emit('deleteFileSuccess' , {
                message: 'File deleted successfully',
            });
        }catch(err){
            console.error("Error deleting file:", err);
            socket.emit('error', {
                message: 'Failed to delete file', error: err
            });
        }
    });

    socket.on('createFolder' , async (fileData , path) => {
        try{
            await fs.mkdir(path);
            editorNamespace.emit('createFileSuccess' , {
                message: 'Folder created successfully',
            });
        }catch(err){
            console.error("Error creating folder:", err);
            socket.emit('error', {
                message: 'Failed to create folder', error: err
            });
        }
    });

    socket.on('deleteFolder' , async ( path) => {
        try{
            await fs.rm(path, {
                recursive: true,
                force: true
            });
            editorNamespace.emit('deleteFolderSuccess' , {
                message: 'Folder deleted successfully',
            });
        }catch(err){
            console.error("Error deleting folder:", err);
            socket.emit('error', {
                message: 'Failed to delete folder', error: err
            });
        }
    });

    socket.on('renameFileFolder' , async (oldPath , newPath) => {
        try{
            await fs.rename(oldPath, newPath);
            editorNamespace.emit('renameFileFolderSuccess' , {
                message: 'File renamed successfully',
            });
        }catch(err){
            console.error("Error renaming file:", err);
            socket.emit('error', {
                message: 'Failed to rename file', error: err
            });
        }
    });

    socket.on('disconnect', () => {
    });
  
}