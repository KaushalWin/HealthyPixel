# Contributing to PixieTrack

Thank you for your interest in contributing to PixieTrack! We welcome bug reports, feature requests, documentation improvements, and code contributions.

## Important: Ownership & License

**Before contributing, please read this carefully.**

By contributing to PixieTrack (through pull requests, issues, comments, or any other means), you agree to the terms outlined in the [LICENSE](LICENSE) file, specifically:

### Key Points:

1. **All contributions become the exclusive property of the PixieTrack creator** upon acceptance and merger.

2. **The creator retains full ownership and rights** to all code, documentation, and ideas submitted, including the right to modify, redistribute, or relicense them.

3. **You assign ownership of accepted contributions** to the creator as defined in the LICENSE (assignment, not only a license grant).

4. **You can be credited as a contributor** (in a contributors list, if you wish), but this does not confer ownership.

5. **You waive any moral rights or claims** to your contributions.

If you do not agree to these terms, **please do not contribute**. This is non-negotiable and applies to all contributions.

---

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates.
2. **Create a new issue** with:
   - Clear title describing the bug
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots (if applicable)
   - Environment (OS, browser, device)

### Requesting Features

1. **Check existing issues** first.
2. **Create a new issue** with:
   - Clear title describing the feature
   - Why you need it (use case)
   - How it should work (ideally)
   - Any relevant links or examples

### Submitting Code

#### Before You Code:
- **Discuss major changes**: Open an issue first to discuss significant features or changes.
- **Small fixes**: PRs for typos, bug fixes, and improvements are welcome without prior discussion.

#### Code Guidelines:
- **Use TypeScript** for new code.
- **Follow existing code style** (Prettier, ESLint configs provided).
- **Write clear commit messages** (e.g., "Fix: BP input validation" or "Feature: Add glucose metric").
- **Keep commits atomic** (one logical change per commit).
- **Test locally** before submitting:
  ```bash
  npm run build
  npm run dev
  ```

#### Submitting a Pull Request:
1. **Fork the repository**.
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**.
4. **Commit with clear messages**.
5. **Push to your fork**: `git push origin feature/your-feature-name`
6. **Open a PR** with:
   - Clear title describing changes
   - Reference any related issues (#123)
   - Explanation of what and why
   - Screenshots/demos (if applicable)

#### PR Review Process:
- The creator will review your PR.
- Feedback may be requested.
- Once approved, your PR will be merged and your contribution assigned to the creator.
- You'll be credited in the CONTRIBUTORS file (if you wish).

---

## Code of Conduct

Be respectful, constructive, and follow these principles:

- **Be kind**: Treat all contributors with respect.
- **Be constructive**: Provide helpful feedback, not criticism.
- **Stay on topic**: Keep discussions focused on the project.
- **No spam, harassment, or discrimination**: This will result in removal.

---

## Development Setup

See [TECHNICAL_CONTEXT.md](TECHNICAL_CONTEXT.md) for full setup instructions.

**Quick Start:**
```bash
git clone https://github.com/yourusername/health-tracker.git
cd health-tracker
npm install
npm run dev
```

---

## Project Structure

See [README.md](README.md) for folder structure.

Key directories:
- `src/components/` - React components
- `src/hooks/` - Custom hooks (state management)
- `src/utils/` - Utilities (storage, export)
- `public/` - Static files (manifest, icons)

---

## What We're Looking For

### High Priority:
- Bug fixes
- Performance improvements
- Mobile responsiveness improvements
- TypeScript improvements (stricter types)
- Documentation improvements
- Accessibility enhancements

### Considered:
- New health metrics (with discussion)
- UI/UX improvements
- Testing infrastructure

### Unlikely to Be Merged:
- Significant architecture changes (discuss first)
- Backend/server code (defeats the purpose)
- Third-party service integrations (privacy concern)
- Ads or monetization (user experience concern)

---

## Attribution & Credits

Contributors are listed in [CONTRIBUTORS.md](CONTRIBUTORS.md) (if you opt-in).

However, **please note**: This is purely for recognition. It does not grant any ownership rights to the project or your contributions. All contributions become the property of the creator.

---

## Questions?

- **Project questions**: Open a GitHub issue.
- **License/ownership questions**: Check the [LICENSE](LICENSE) file.
- **Direct contact**: Reach out via GitHub issues.

---

## License Reminder

By contributing, you agree to assign all rights to your contributions to the PixieTrack creator. Read the [LICENSE](LICENSE) file for full terms.

**Thank you for contributing!**
