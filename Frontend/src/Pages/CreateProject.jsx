import React, { useState } from 'react';
import { Button, Alert, ConfigProvider, theme as antdTheme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCrateProject } from '../Hooks/Apis/Mutations/useCreateProject';

const techInfo = {
  react: {
    name: 'React',
    description: 'A JavaScript library for building UIs',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
  },
  vue: {
    name: 'Vue',
    description: 'The Progressive JavaScript Framework',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg',
  },
  vanilla: {
    name: 'Vanilla JS',
    description: 'Plain JavaScript without frameworks',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png',
  },
  angular: {
    name: 'Angular',
    description: 'Robust framework for building web apps',
    logo: 'https://angular.io/assets/images/logos/angular/angular.svg',
  },
  next: {
    name: 'Next.js',
    description: 'React framework for SSR & full-stack apps',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg',
  },
  svelte: {
    name: 'Svelte',
    description: 'Compiler-based UI framework',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg',
  },
  typescript: {
    name: 'TypeScript',
    description: 'Typed superset of JavaScript',
    logo: 'https://cdn.worldvectorlogo.com/logos/typescript.svg',
  },
  tailwind: {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
  },
};

function CreateProject() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { createProject, isPending, isSuccess, error, data } = useCrateProject();
  const navigate = useNavigate();

  const handleCreateProject = () => {
    if (!selectedTemplate) return;
    createProject()
      .then((data) => {
        console.log('Project created successfully:', data);
      })
      .catch((err) => {
        console.error('Error creating project:', err);
      });
  };  

  return (
    <ConfigProvider theme={{ algorithm: antdTheme.darkAlgorithm }}>
      <div className="min-h-screen bg-[#1e1e1e] text-white flex items-center justify-center px-4 py-10 font-mono">
        <div className="w-full max-w-6xl border border-[#333] rounded-sm shadow-lg bg-[#121212] p-10">
          <h2 className="text-3xl font-semibold text-center mb-8"> Create a New Project</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 mb-8">
            {Object.entries(techInfo).map(([key, tech]) => (
              <div
                key={key}
                onClick={() => setSelectedTemplate(key)}
                className={`cursor-pointer rounded-sm p-4 border text-center transition-all hover:shadow-lg ${
                  selectedTemplate === key
                    ? 'bg-[#1f3b4d] border-[#007acc] shadow-[0_0_10px_#007acc]'
                    : 'bg-[#1a1a1a] border-[#333] hover:border-[#555]'
                }`}
              >
                <img src={tech.logo} alt={tech.name} className="w-10 h-10 mx-auto mb-2 object-contain" />
                <h3 className="text-md font-semibold">{tech.name}</h3>
                <p className="text-xs text-gray-400">{tech.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-6">
            <Button
              type="primary"
              size="large"
              className="bg-[#007acc] text-white px-6 py-1 rounded hover:bg-[#005f99]"
              onClick={handleCreateProject}
              disabled={isPending || !selectedTemplate}
            >
              {isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>

          {isSuccess && (
            <div className="flex flex-col sm:flex-row justify-between items-center bg-[#1e3a2f] border border-green-500 rounded-lg px-4 py-3 mt-6">
              <Alert
                message="Project created successfully!"
                type="success"
                showIcon
                className="mb-2 sm:mb-0 sm:mr-4 w-full sm:w-auto"
              />
              <Button
                type="default"
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                onClick={() => navigate(`/project/${data.projectId}`)}
              >
                Go to Project
              </Button>
            </div>
          )}

          {error && (
            <Alert
              message="Error creating project"
              description={error.message}
              type="error"
              showIcon
              className="mt-4"
            />
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}

export default CreateProject;
