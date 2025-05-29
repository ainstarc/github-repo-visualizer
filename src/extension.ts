import * as vscode from 'vscode';
import fetch from 'node-fetch';

const GITHUB_USERNAME = 'ainstarc';

interface Repo {
	name: string;
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;
	commit_count?: number;
	languages?: Record<string, number>;
	labels?: Record<string, number>;
}




export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('githubRepoVisualizer.showRepos', async () => {
		try {
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Window,
				title: "Fetching GitHub Repositories...",
				cancellable: false
			}, async () => {
				const repos = await fetchRepos(GITHUB_USERNAME);

				const items = repos.map(repo => {
					const topLanguages = repo.languages
						? Object.entries(repo.languages)
							.sort((a, b) => b[1] - a[1])
							.slice(0, 2)
							.map(([lang]) => lang)
							.join(', ')
						: 'N/A';
					const labelSummary = repo.labels
						? Object.entries(repo.labels)
							.filter(([name]) =>
								['good first issue', 'help wanted', 'bug'].includes(name.toLowerCase())
							)
							.map(([name, count]) => `${name}: ${count}`)
							.join(' | ')
						: 'No labels';


					return {
						label: repo.name,
						description: `⭐ ${repo.stargazers_count} 🍴 ${repo.forks_count} ❗ ${repo.open_issues_count} 🔁 ${repo.commit_count || 0} 🧠 ${topLanguages} 🏷️ ${labelSummary}`

					};
				});


				if (items.length === 0) {
					vscode.window.showInformationMessage('No repositories found for this user.');
					return;
				}
				vscode.window.showQuickPick(items, { placeHolder: 'Select a repository to view stats' });
			});
		} catch (err: any) {
			vscode.window.showErrorMessage(`Error: ${err.message}`);
		}
	});

	context.subscriptions.push(disposable);
}

async function fetchRepos(username: string): Promise<Repo[]> {
	const response = await fetch(`https://api.github.com/users/${username}/repos`);
	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.statusText}`);
	}
	const repos = await response.json();

	// Add commit count for each repo
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
		if (issue.pull_request) { continue; }
		for (const label of issue.labels) {
			if (typeof label === 'object' && label.name) {
				labelCount[label.name] = (labelCount[label.name] || 0) + 1;
			}
		}
	}

	return labelCount;
}



export function deactivate() { }
