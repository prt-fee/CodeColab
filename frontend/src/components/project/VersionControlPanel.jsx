
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitBranch, GitPullRequest } from 'lucide-react';

const CommitItem = ({ commit }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="flex items-start p-3 border-b last:border-b-0">
      <div className="flex-1">
        <p className="font-medium break-all">{commit.message}</p>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <span className="mr-3">{commit.author}</span>
          <span>{formatDate(commit.date)}</span>
        </div>
      </div>
    </div>
  );
};

const PullRequestItem = ({ pr }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="flex items-start p-3 border-b last:border-b-0">
      <div className="flex-1">
        <p className="font-medium">{pr.title}</p>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <span className="mr-3">by {pr.author}</span>
          <span className={`px-2 py-0.5 rounded-full ${
            pr.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {pr.status}
          </span>
          <span className="ml-3">{formatDate(pr.date)}</span>
        </div>
      </div>
    </div>
  );
};

const CommitsPanel = ({ commits, onNewCommitClick }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Commit History</CardTitle>
          <CardDescription>
            Track changes to your project files
          </CardDescription>
        </div>
        <Button onClick={onNewCommitClick}>
          <GitBranch className="h-4 w-4 mr-2" />
          New Commit
        </Button>
      </CardHeader>
      <CardContent>
        {!commits || commits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No commits yet</p>
            <Button onClick={onNewCommitClick}>
              Make Your First Commit
            </Button>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden divide-y">
            {commits.map(commit => (
              <CommitItem key={commit.id} commit={commit} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PullRequestsPanel = ({ pullRequests }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pull Requests</CardTitle>
          <CardDescription>
            Review and merge code changes
          </CardDescription>
        </div>
        <Button>
          <GitPullRequest className="h-4 w-4 mr-2" />
          New PR
        </Button>
      </CardHeader>
      <CardContent>
        {!pullRequests || pullRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No pull requests yet</p>
            <Button>
              Create Pull Request
            </Button>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden divide-y">
            {pullRequests.map(pr => (
              <PullRequestItem key={pr.id} pr={pr} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const VersionControlPanel = ({ activeTab, commits, pullRequests, onNewCommitClick }) => {
  return (
    <>
      {activeTab === 'commits' && (
        <CommitsPanel 
          commits={commits} 
          onNewCommitClick={onNewCommitClick} 
        />
      )}
      
      {activeTab === 'pulls' && (
        <PullRequestsPanel 
          pullRequests={pullRequests} 
        />
      )}
    </>
  );
};

export default VersionControlPanel;
export { CommitsPanel, PullRequestsPanel };
