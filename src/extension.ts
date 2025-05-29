import * as vscode from 'vscode';
import { fetchRepos } from './githubAPI';
import { getWebviewContent, setupWebviewMessageListener } from './dashboardWebview';

const GITHUB_USERNAME = 'ainstarc';

export function activate(context: vscode.ExtensionContext) {

	// Command: Show repo list in QuickPick
	const showReposCmd = vscode.commands.registerCommand('githubRepoVisualizer.showRepos', async () => {
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
						description: `⭐ ${repo.stargazers_count}  🍴 ${repo.forks_count}  ❗ ${repo.open_issues_count}  🔁 ${repo.commit_count || 0}  🧠 ${topLanguages}  🏷️ ${labelSummary}`
					};
				});
				vscode.window.showQuickPick(items, { placeHolder: 'Select a repository to view stats' });
			});
		} catch (err: any) {
			vscode.window.showErrorMessage(`Error: ${err.message}`);
		}
	});

	// Command: Show dashboard in Webview
	const showDashboardCmd = vscode.commands.registerCommand('githubRepoVisualizer.showDashboard', async () => {
		const panel = vscode.window.createWebviewPanel(
			'githubRepoVisualizer',
			'GitHub Repo Dashboard',
			vscode.ViewColumn.One,
			{ enableScripts: true }
		);

		panel.webview.html = getWebviewContent();

		setupWebviewMessageListener(panel.webview, GITHUB_USERNAME);
	});

	context.subscriptions.push(showReposCmd, showDashboardCmd);
}

export function deactivate() { }
