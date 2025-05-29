import * as vscode from 'vscode';
import { fetchRepos, Repo } from './githubAPI';


export function getWebviewContent(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>GitHub Repo Dashboard</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; margin: 20px; }
  h1 { color: #007acc; }
  .repo-card { border: 1px solid #ddd; border-radius: 6px; padding: 15px; margin-bottom: 10px; }
  .repo-name { font-weight: bold; font-size: 1.2em; }
  .stats { margin-top: 5px; font-size: 0.9em; color: #555; }
  .labels { margin-top: 5px; font-size: 0.85em; color: #007acc; }
</style>
</head>
<body>
  <h1>GitHub Repo Dashboard</h1>
  <div id="repoContainer">Loading repositories...</div>

  <script>
    const vscode = acquireVsCodeApi();

    window.addEventListener('message', event => {
      const repos = event.data;
      const container = document.getElementById('repoContainer');
      container.innerHTML = '';

      if (!repos || repos.length === 0) {
        container.textContent = 'No repositories found.';
        return;
      }

      repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';

        const name = document.createElement('div');
        name.className = 'repo-name';
        name.textContent = repo.name;

        const stats = document.createElement('div');
        stats.className = 'stats';
        stats.textContent = 
          "⭐ Stars: " + repo.stargazers_count + " | 🍴 Forks: " + repo.forks_count + " | ❗ Issues: " + repo.open_issues_count + " | 🔁 Commits: " + (repo.commit_count || 0);

        const languages = repo.languages 
          ? Object.keys(repo.languages).slice(0, 3).join(', ') 
          : 'N/A';

        const langs = document.createElement('div');
        langs.className = 'stats';
        langs.textContent = "🧠 Languages: " + languages;

        const labelsArr = repo.labels
          ? Object.entries(repo.labels)
              .filter(([name]) => ['good first issue', 'help wanted', 'bug'].includes(name.toLowerCase()))
              .map(([name, count]) => name + ": " + count)
          : [];

        const labels = document.createElement('div');
        labels.className = 'labels';
        labels.textContent = labelsArr.length > 0 ? "🏷️ Labels: " + labelsArr.join(' | ') : '🏷️ No labels';

        card.appendChild(name);
        card.appendChild(stats);
        card.appendChild(langs);
        card.appendChild(labels);

        container.appendChild(card);
      });
    });

    // Request repo data from extension host on load
    vscode.postMessage({ command: 'fetchRepos' });
  </script>
</body>
</html>`;
}

// Listen for messages from the Webview and respond with repo data
export function setupWebviewMessageListener(webview: vscode.Webview, username: string) {
    webview.onDidReceiveMessage(async message => {
        if (message.command === 'fetchRepos') {
            try {
                const repos = await fetchRepos(username);
                webview.postMessage(repos);
            } catch (error) {
                webview.postMessage([]);
            }
        }
    });
}
