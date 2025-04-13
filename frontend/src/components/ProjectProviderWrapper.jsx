
import React from 'react';
import { ProjectProvider } from '../context/ProjectContext';

export const ProjectProviderWrapper = ({ children }) => {
  return (
    <ProjectProvider>
      {children}
    </ProjectProvider>
  );
};
