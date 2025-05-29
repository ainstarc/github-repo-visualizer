import fetch from 'node-fetch';

export interface Repo {
    name: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    commit_count?: number;
    languages?: Record<string, number>;
    labels?: Record<string, number>;
}

export async function fetchRepos(username: string): Promise<Repo[]> {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
    }
    const repos: Repo[] = await response.json();

    for (const repo of repos) {
        repo.commit_count = await fetchCommitCount(username, repo.name);
        repo.languages = await fetchLanguages(username, repo.name);
        repo.labels = await fetchIssueLabels(username, repo.name);
    }

    return repos;
}

async function fetchCommitCount(owner: string, repo: string): Promise<number> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`;
    const response = await fetch(url);
    if (!response.ok) { return 0; }

    const contributors = await response.json();
    return contributors.reduce((sum: number, c: any) => sum + (c.contributions || 0), 0);
}

async function fetchLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    const url = `https://api.github.com/repos/${owner}/${repo}/languages`;
    const response = await fetch(url);
    if (!response.ok) { return {}; }

    return await response.json();
}

async function fetchIssueLabels(owner: string, repo: string): Promise<Record<string, number>> {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100`;
    const response = await fetch(url);
    if (!response.ok) { return {}; }

    const issues = await response.json();
    const labelCount: Record<string, number> = {};

    for (const issue of issues) {
        if (issue.pull_request) { continue; } // skip PRs
        for (const label of issue.labels) {
            if (typeof label === 'object' && label.name) {
                labelCount[label.name] = (labelCount[label.name] || 0) + 1;
            }
        }
    }

    return labelCount;
}
