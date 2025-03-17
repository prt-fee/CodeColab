
// Mock project templates
export const mockProjects = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Redesign the company website with a modern look and feel',
    color: 'blue',
    dueDate: new Date('2023-06-30'),
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=4' }
    ],
    tasksCount: {
      total: 12,
      completed: 8
    },
    files: [
      { id: '1', name: 'index.html', type: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Website Redesign</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>' },
      { id: '2', name: 'styles.css', type: 'css', content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}' },
      { id: '3', name: 'script.js', type: 'js', content: 'document.addEventListener("DOMContentLoaded", function() {\n  console.log("Document ready!");\n});' }
    ],
    meetings: [
      { id: '1', title: 'Project Kickoff', date: new Date('2023-05-15T10:00:00'), duration: 60, attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'] },
      { id: '2', title: 'Design Review', date: new Date('2023-05-22T14:00:00'), duration: 45, attendees: ['John Doe', 'Sarah Williams'] },
      { id: '3', title: 'Progress Update', date: new Date('2023-05-29T11:00:00'), duration: 30, attendees: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'] }
    ],
    commits: [
      { id: '1', message: 'Initial commit', author: 'John Doe', date: new Date('2023-05-10T10:00:00') },
      { id: '2', message: 'Add header styles', author: 'Jane Smith', date: new Date('2023-05-12T14:30:00') },
      { id: '3', message: 'Fix navigation menu', author: 'Mike Johnson', date: new Date('2023-05-14T09:15:00') }
    ],
    pullRequests: [
      { id: '1', title: 'Feature: Add contact form', author: 'Jane Smith', status: 'open', date: new Date('2023-05-14T15:20:00') },
      { id: '2', title: 'Fix: Mobile responsive layout', author: 'Mike Johnson', status: 'merged', date: new Date('2023-05-13T11:45:00') }
    ],
    collaborators: [
      { id: 'c1', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2', role: 'editor', addedAt: '2023-05-08T15:20:00' },
      { id: 'c2', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3', role: 'editor', addedAt: '2023-05-09T10:15:00' }
    ],
    collaborationActivity: [
      { id: 'a1', type: 'edit', user: 'Jane Smith', target: 'styles.css', timestamp: '2023-05-14T16:30:00', message: 'Jane Smith edited styles.css' },
      { id: 'a2', type: 'commit', user: 'Mike Johnson', target: 'main', timestamp: '2023-05-14T15:45:00', message: 'Mike Johnson committed "Update navigation links"' },
      { id: 'a3', type: 'invitation', user: 'John Doe', target: 'sarah@example.com', timestamp: '2023-05-13T11:20:00', message: 'John Doe invited sarah@example.com to collaborate' }
    ]
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Create a new mobile app for customer engagement',
    color: 'green',
    dueDate: new Date('2023-08-15'),
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' }
    ],
    tasksCount: {
      total: 20,
      completed: 5
    },
    files: [
      { id: '1', name: 'App.js', type: 'js', content: 'import React from "react";\n\nconst App = () => {\n  return (\n    <div>\n      <h1>Mobile App</h1>\n    </div>\n  );\n};\n\nexport default App;' },
      { id: '2', name: 'styles.css', type: 'css', content: 'body {\n  font-family: Arial, sans-serif;\n}\n\nh1 {\n  color: green;\n}' }
    ],
    meetings: [
      { id: '1', title: 'Sprint Planning', date: new Date('2023-05-16T09:00:00'), duration: 90, attendees: ['John Doe', 'Jane Smith'] },
      { id: '2', title: 'Client Demo', date: new Date('2023-05-30T15:00:00'), duration: 60, attendees: ['John Doe', 'Jane Smith'] }
    ],
    commits: [
      { id: '1', message: 'Initial setup', author: 'John Doe', date: new Date('2023-05-08T10:00:00') },
      { id: '2', message: 'Create app structure', author: 'Jane Smith', date: new Date('2023-05-10T14:30:00') }
    ],
    pullRequests: [
      { id: '1', title: 'Feature: User authentication', author: 'John Doe', status: 'open', date: new Date('2023-05-12T15:20:00') }
    ]
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Plan and execute Q3 marketing campaign',
    color: 'orange',
    dueDate: new Date('2023-07-10'),
    members: [
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
      { id: '5', name: 'Alex Brown', email: 'alex@example.com', avatar: 'https://i.pravatar.cc/150?img=5' }
    ],
    tasksCount: {
      total: 8,
      completed: 2
    },
    files: [
      { id: '1', name: 'campaign.md', type: 'md', content: '# Marketing Campaign\n\n## Objectives\n\n- Increase brand awareness\n- Generate leads\n- Drive website traffic\n\n## Target Audience\n\n- Small to medium businesses\n- Tech enthusiasts\n- Decision makers' },
      { id: '2', name: 'budget.csv', type: 'csv', content: 'Item,Budget,Actual\nSocial Media,$2000,$1850\nEmail Marketing,$1500,$1500\nContent Creation,$3000,$3200\nPaid Ads,$5000,$4800' }
    ],
    meetings: [
      { id: '1', title: 'Campaign Strategy', date: new Date('2023-05-17T11:00:00'), duration: 60, attendees: ['Mike Johnson', 'Sarah Williams', 'Alex Brown'] }
    ],
    commits: [
      { id: '1', message: 'Add campaign overview', author: 'Mike Johnson', date: new Date('2023-05-09T11:00:00') },
      { id: '2', message: 'Update budget details', author: 'Sarah Williams', date: new Date('2023-05-11T13:45:00') }
    ],
    pullRequests: []
  }
];
