import {create} from 'zustand';

export const useActiveFileTabStore = create((set) => ({
  openTabs: [],
  activeFileTab: null,

  setActiveFileTab: (path, name, extension, content) =>
    set((state) => {
      const file = { path, name, extension, content };
      const alreadyOpen = state.openTabs.some((tab) => tab.path === path);
      return {
        openTabs: alreadyOpen ? state.openTabs : [...state.openTabs, file],
        activeFileTab: file,
      };
    }),

  closeTab: (filePath) =>
    set((state) => {
      const newTabs = state.openTabs.filter((tab) => tab.path !== filePath);
      const isClosedTabActive = state.activeFileTab?.path === filePath;
      return {
        openTabs: newTabs,
        activeFileTab: isClosedTabActive
          ? newTabs.length > 0
            ? newTabs[0]
            : null
          : state.activeFileTab,
      };
    }),

  // ✅ Add this
updateActiveFileContent: (newContent, path) => {
  set((state) => ({
    openTabs: state.openTabs.map(tab =>
      tab.path === path ? { ...tab, content: newContent } : tab
    ),
    activeFileTab:
      state.activeFileTab?.path === path
        ? { ...state.activeFileTab, content: newContent }
        : state.activeFileTab
  }));
}

}));
