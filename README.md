# GitHub Repo Visualizer

A Visual Studio Code extension to visualize your GitHub repository statistics directly inside VS Code.

## Features

- **QuickPick Repo List:**  
  View your repositories in a searchable QuickPick with stats including stars, forks, open issues, commit count, top languages, and key issue labels.

- **Dashboard Webview:**  
  See a dashboard of your repositories with cards showing:
  - Name
  - Stars, forks, open issues, commit count
  - Top 3 languages
  - Counts for "good first issue", "help wanted", and "bug" labels

## Getting Started

1. **Install the extension** in VS Code.
2. **Run commands:**
   - `GitHub Repo Visualizer: Show My Repos` — Opens a QuickPick list of your repositories.
   - `GitHub Repo Visualizer: Show Dashboard` — Opens a dashboard webview with detailed stats.

## Requirements

- VS Code 1.100.0 or newer
- Internet connection (to fetch GitHub data)
- (Optional) Update the GitHub username in `src/extension.ts` (`GITHUB_USERNAME` constant) to visualize your own repositories.

## Extension Settings

This extension does not contribute any settings yet.

## Known Issues

- Only supports a hardcoded GitHub username (`ainstarc`) by default.
- No authentication; only public repositories are shown.
- No pagination for users with many repositories.

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md) for details.

---

## Development

- Run `npm install` to install dependencies.
- Use `npm run watch` for development.
- Use `F5` in VS Code to launch an Extension Development Host.

---

## License

MIT
