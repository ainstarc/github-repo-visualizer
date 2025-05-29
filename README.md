# GitHub Repo Visualizer

A Visual Studio Code extension to visualize your GitHub repository statistics directly inside VS Code.

## 🚀 Features

- **QuickPick Repo List**  
  View your repositories in a searchable QuickPick interface showing:

  - ⭐ Stars
  - 🍴 Forks
  - 🐛 Open issues
  - 📦 Commit count
  - 🧠 Top languages
  - 🏷️ Issue labels like `good first issue`, `help wanted`, and `bug`

- **Dashboard Webview**  
  See a visual dashboard with cards for each repository, showing:
  - Repository name
  - Key stats (stars, forks, issues, commits)
  - Top 3 languages
  - Label counts (good first issue, help wanted, bug)

## ⚙️ Getting Started

1. **Install the extension** in VS Code.
2. **Run commands:**
   - `GitHub Repo Visualizer: Show My Repos` – Opens a QuickPick list of repositories.
   - `GitHub Repo Visualizer: Show Dashboard` – Opens a dashboard webview with visual stats.

## 📋 Requirements

- VS Code `v1.100.0` or newer
- Internet connection (to fetch GitHub data)
- (Optional) Update the GitHub username in `src/extension.ts` (`GITHUB_USERNAME`) to visualize your own repositories.

## 🛠 Extension Settings

This extension currently does not contribute any settings.

## ⚠️ Known Issues

- Only supports a hardcoded GitHub username (`ainstarc`) by default
- No GitHub authentication; only public repositories are supported
- No pagination support yet for users with many repositories

## 📝 Release Notes

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

---

## 🧪 Development

```bash
npm install       # Install dependencies
npm run watch     # Start TypeScript in watch mode
```

- Use `F5` in VS Code to launch an Extension Development Host.

## License

MIT
