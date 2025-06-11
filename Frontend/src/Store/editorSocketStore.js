import { create } from "zustand";
import { useActiveFileTabStore } from "./activeFileTabStore";

export const useEditorSocketStore = create((set) => {
  const getFileExtension = (fileName) => fileName.split('.').pop();

  return {
    editorSocket: null,

    setEditorSocket: (incomingSocket) => {
      incomingSocket?.off("readFileSuccess");
      incomingSocket?.off("writeFileSuccess");

      incomingSocket?.on("readFileSuccess", (data) => {
        console.log("read file succes called");
        const {
          openTabs,
          setActiveFileTab,
          updateActiveFileContent,
          setOpenTabs // just in case you need to update the tab list
        } = useActiveFileTabStore.getState();

        const isTabAlreadyOpen = openTabs.some(tab => tab.path === data.path);

        if (isTabAlreadyOpen) {
          // console.log("Tab already open, updating content");
          updateActiveFileContent(data.data, data.path); // ✅ Only update content
        } else {
          setActiveFileTab(
            data.path,
            data.name,
            getFileExtension(data.name),
            data.data
          ); // ✅ Only activate tab if it's not already open
        }
      });

      incomingSocket?.on("writeFileSuccess", (data) => {
        console.log("File written successfully", data.response);
        incomingSocket.emit("readFile", {
          path: data.path,
          name: data.name,
        });
      });

      set({
        editorSocket: incomingSocket,
      });
    },
  };
});
