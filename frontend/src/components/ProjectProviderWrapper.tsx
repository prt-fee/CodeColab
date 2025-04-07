import { ProjectProvider } from '@/context/ProjectContext';

export const ProjectProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProjectProvider>
      {children}
    </ProjectProvider>
  );
};
