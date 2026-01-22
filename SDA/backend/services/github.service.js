import { Octokit } from "octokit";
import simpleGit from "simple-git";
import path from "path";
import fs from "fs/promises";
import os from "os";
import projectModel from "../models/project.model.js";

/**
 * GitHub MCP Service
 * Handles GitHub API interactions for the @github command
 */
class GitHubMCPService {
    constructor() {
        this.octokit = null;
        this.git = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the GitHub service with authentication
     */
    async initialize() {
        if (this.isInitialized) return;

        const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
        if (!token) {
            throw new Error("GitHub Personal Access Token not configured. Please set GITHUB_PERSONAL_ACCESS_TOKEN in .env");
        }

        this.octokit = new Octokit({ auth: token });
        this.git = simpleGit();
        this.isInitialized = true;

        // Verify authentication
        try {
            const { data } = await this.octokit.rest.users.getAuthenticated();
            console.log(`GitHub authenticated as: ${data.login}`);
            return data;
        } catch (error) {
            this.isInitialized = false;
            throw new Error(`GitHub authentication failed: ${error.message}`);
        }
    }

    /**
     * Get authenticated user info
     */
    async getUser() {
        await this.initialize();
        const { data } = await this.octokit.rest.users.getAuthenticated();
        return data;
    }

    /**
     * Get repository information
     */
    async getRepository(owner, repo) {
        await this.initialize();
        const { data } = await this.octokit.rest.repos.get({ owner, repo });
        return data;
    }

    /**
     * Create a new repository for the authenticated user
     */
    async createRepository(name, description = "") {
        await this.initialize();
        const { data } = await this.octokit.rest.repos.createForAuthenticatedUser({
            name,
            description,
            private: false, // Default to public, change logic if needed
            auto_init: true, // Create with README so we can pull immediately if needed, though we usually overwrite
        });
        return data;
    }

    /**
     * List repositories for authenticated user
     */
    async listRepositories(options = {}) {
        await this.initialize();
        const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
            sort: options.sort || "updated",
            per_page: options.perPage || 10,
            ...options,
        });
        return data;
    }

    /**
     * List branches for a repository
     */
    async listBranches(owner, repo) {
        await this.initialize();
        const { data } = await this.octokit.rest.repos.listBranches({ owner, repo });
        return data;
    }

    /**
     * Create a new branch
     */
    async createBranch(owner, repo, branchName, fromBranch = "main") {
        await this.initialize();

        // Get the SHA of the source branch
        const { data: ref } = await this.octokit.rest.git.getRef({
            owner,
            repo,
            ref: `heads/${fromBranch}`,
        });

        // Create new branch
        const { data } = await this.octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branchName}`,
            sha: ref.object.sha,
        });

        return data;
    }

    /**
     * List commits for a repository
     */
    async listCommits(owner, repo, options = {}) {
        await this.initialize();
        const { data } = await this.octokit.rest.repos.listCommits({
            owner,
            repo,
            per_page: options.perPage || 10,
            ...options,
        });
        return data;
    }

    /**
     * List pull requests
     */
    async listPullRequests(owner, repo, options = {}) {
        await this.initialize();
        const { data } = await this.octokit.rest.pulls.list({
            owner,
            repo,
            state: options.state || "open",
            per_page: options.perPage || 10,
            ...options,
        });
        return data;
    }

    /**
     * Create a pull request
     */
    async createPullRequest(owner, repo, title, head, base = "main", body = "") {
        await this.initialize();
        const { data } = await this.octokit.rest.pulls.create({
            owner,
            repo,
            title,
            head,
            base,
            body,
        });
        return data;
    }

    /**
     * List issues
     */
    async listIssues(owner, repo, options = {}) {
        await this.initialize();
        const { data } = await this.octokit.rest.issues.listForRepo({
            owner,
            repo,
            state: options.state || "open",
            per_page: options.perPage || 10,
            ...options,
        });
        return data;
    }

    /**
     * Create an issue
     */
    async createIssue(owner, repo, title, body = "", labels = []) {
        await this.initialize();
        const { data } = await this.octokit.rest.issues.create({
            owner,
            repo,
            title,
            body,
            labels,
        });
        return data;
    }

    /**
     * Perform a git push from the project state to the remote repo.
     * Uses a temporary directory to reconstruct the file tree and push.
     */
    async performPush(project, owner, repo, message = "Update from SDA Project") {
        await this.initialize();

        // 1. Create a temporary directory
        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "sda-git-push-"));

        try {
            // 2. Clone the repository (or init and add remote)
            const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
            const remoteUrl = `https://${token}@github.com/${owner}/${repo}.git`;

            const git = simpleGit(tempDir);

            // Try dragging down the current state first to avoid conflict if possible, or just init fresh
            // Since we want to mirror the LOCAL state to remote, we might just want to overwrite.
            // But standard git flow is pull -> update -> push.
            // Let's try cloning first.
            await git.clone(remoteUrl, ".");

            // Configure git local user
            await git.addConfig("user.name", "SDA Assistant");
            await git.addConfig("user.email", "assistant@sda.com");

            // 3. Write project files to the temp directory
            // Note: We need to handle deletions. The easiest way to mirror is to remove everything (except .git) and write fresh.
            // However, that might be too aggressive. Let's just write what we have for now (add/modify).
            // To support deletion, we'd list existing files in temp dir and delete if not in fileTree.
            // Let's implement a clean sync: remove all non-git files then write.

            const filesInRepo = await fs.readdir(tempDir);
            for (const file of filesInRepo) {
                if (file !== ".git") {
                    await fs.rm(path.join(tempDir, file), { recursive: true, force: true });
                }
            }

            // Write all files from project.fileTree
            let writtenCount = 0;
            let fileTreeKeys = [];
            const debugLogs = []; // Store logs to return to user if needed

            if (project.fileTree) {
                fileTreeKeys = Object.keys(project.fileTree);
                console.log(`[GitHub Service] Found ${fileTreeKeys.length} files in DB project.fileTree`);

                for (const [filePath, fileData] of Object.entries(project.fileTree)) {
                    // filePath is like 'src/App.jsx'
                    const fullPath = path.join(tempDir, filePath);
                    const dir = path.dirname(fullPath);

                    try {
                        await fs.mkdir(dir, { recursive: true });

                        let content = "";
                        if (fileData && fileData.file && fileData.file.contents) {
                            content = fileData.file.contents;
                        } else if (typeof fileData === 'string') {
                            content = fileData;
                        } else {
                            console.warn(`[GitHub Service] Skipping file ${filePath}: Invalid data structure`, fileData);
                            debugLogs.push(`Skipped ${filePath} (invalid data)`);
                            continue;
                        }

                        await fs.writeFile(fullPath, content);
                        writtenCount++;

                    } catch (writeErr) {
                        console.error(`[GitHub Service] Error writing file ${filePath}:`, writeErr);
                        debugLogs.push(`Error writing ${filePath}: ${writeErr.message}`);
                    }
                }
            } else {
                console.warn("[GitHub Service] project.fileTree is undefined or null");
            }

            // 4. Git operations
            await git.add(".");
            const status = await git.status();
            console.log(`[GitHub Service] Git status: ${status.files.length} changed files`);

            if (status.files.length === 0) {
                return {
                    success: true,
                    message: `No changes detected to push.\nDebug Stats:\n- DB Files Found: ${fileTreeKeys.length}\n- Files Written: ${writtenCount}\n- Git Status Files: ${status.files.length}\n- Logs: ${debugLogs.join(", ") || "None"}`
                };
            }

            await git.commit(message);
            await git.push("origin", "main");

            const filesPushed = status.files.map(f => f.path).slice(0, 5).join(", ");
            const moreCount = status.files.length > 5 ? ` and ${status.files.length - 5} more` : "";

            return { success: true, message: `Pushed successfully. \nFiles: ${filesPushed}${moreCount}` };

        } catch (error) {
            throw error;
        } finally {
            // Cleanup
            try {
                await fs.rm(tempDir, { recursive: true, force: true });
            } catch (e) {
                console.error("Failed to cleanup temp dir:", e);
            }
        }
    }

    /**
     * Perform a git pull from remote repo to the project state.
     */
    async performPull(project, owner, repo) {
        await this.initialize();

        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "sda-git-pull-"));

        try {
            const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
            const remoteUrl = `https://${token}@github.com/${owner}/${repo}.git`;
            const git = simpleGit(tempDir);

            // Clone
            await git.clone(remoteUrl, ".");

            // Read files recursively
            const newFileTree = {};

            async function readDir(currentPath) {
                const entries = await fs.readdir(currentPath, { withFileTypes: true });

                for (const entry of entries) {
                    if (entry.name === ".git") continue;

                    const fullPath = path.join(currentPath, entry.name);
                    // key relative to tempDir
                    const relativePath = path.relative(tempDir, fullPath).replace(/\\/g, "/");

                    if (entry.isDirectory()) {
                        await readDir(fullPath);
                    } else {
                        const content = await fs.readFile(fullPath, "utf-8");
                        newFileTree[relativePath] = {
                            file: {
                                contents: content
                            }
                        };
                    }
                }
            }

            await readDir(tempDir);

            // Update project
            project.fileTree = newFileTree;
            await project.save();

            return { success: true, message: "Pulled successfully. Project updated.", fileTree: newFileTree };

        } catch (error) {
            throw error;
        } finally {
            // Cleanup
            try {
                await fs.rm(tempDir, { recursive: true, force: true });
            } catch (e) {
                console.error("Failed to cleanup temp dir:", e);
            }
        }
    }
}

// Singleton instance
const githubService = new GitHubMCPService();

/**
 * Parse and handle GitHub commands from chat messages
 * @param {string} command - The command string (without @github prefix)
 * @param {object} project - The current project object
 * @returns {object} - Result object with text response
 */
export async function handleGitHubCommand(command, project) {
    const defaultOwner = process.env.GITHUB_DEFAULT_OWNER;

    // Strategy: 
    // 1. Try to find package.json and get name from it
    // 2. Fallback to project name
    let repoName = project.name.replace(/\s+/g, "-").toLowerCase();

    try {
        if (project.fileTree && project.fileTree["package.json"]) {
            const packageJsonContent = project.fileTree["package.json"].file.contents;
            const packageData = JSON.parse(packageJsonContent);
            if (packageData.name) {
                // Sanitize package name to be URL safe for GitHub
                repoName = packageData.name.replace(/[^a-zA-Z0-9-_.]/g, "-").toLowerCase();
            }
        }
    } catch (err) {
        console.warn("Failed to parse package.json for repo name, falling back to project name:", err);
    }

    // Normalize command
    const normalizedCommand = command.toLowerCase().trim();
    const parts = normalizedCommand.split(/\s+/);
    const action = parts[0];

    try {
        // Authenticate just to get the user name if needed (or verify token)
        const user = await githubService.getUser();
        const owner = defaultOwner || user.login;

        // --- PUSH COMMAND ---
        if (action === "push") {
            const message = parts.slice(1).join(" ") || "Updates from SDA";
            let repoExists = false;

            // Check if repo exists
            try {
                await githubService.getRepository(owner, repoName);
                repoExists = true;
            } catch (e) {
                repoExists = false;
            }

            let responseText = "";

            if (!repoExists) {
                responseText += `Repository ${owner}/${repoName} does not exist. Creating it...\n`;
                try {
                    await githubService.createRepository(repoName, `Project: ${project.name}`);
                    responseText += `✅ Repository created successfully.\n`;
                } catch (createError) {
                    return {
                        text: `❌ Failed to create repository: ${createError.message}`,
                        type: "error"
                    };
                }
            }

            responseText += `Pushing code to ${owner}/${repoName}...\n`;

            const result = await githubService.performPush(project, owner, repoName, message);

            if (result.success) {
                responseText += `✅ ${result.message}\nLink: https://github.com/${owner}/${repoName}`;
                return { text: responseText, type: "success" };
            } else {
                return { text: `❌ Push failed.`, type: "error" };
            }
        }

        // --- PULL COMMAND ---
        if (action === "pull") {
            // Check if repo exists
            try {
                await githubService.getRepository(owner, repoName);
            } catch (e) {
                return { text: `❌ Repository ${owner}/${repoName} not found. Cannot pull.`, type: "error" };
            }

            const result = await githubService.performPull(project, owner, repoName);
            return {
                text: `✅ ${result.message}`,
                type: "success",
                fileTree: result.fileTree
            };
        }


        // Status command
        if (action === "status" || action === "info") {
            let repoInfo = null;
            try {
                repoInfo = await githubService.getRepository(owner, repoName);
            } catch (e) { }

            const repos = await githubService.listRepositories({ perPage: 5 });

            return {
                text: `✅ **GitHub Connected**\n\n**User:** ${user.login}\n**Name:** ${user.name || "N/A"}\n\n**Project Target Repo:** [${owner}/${repoName}](https://github.com/${owner}/${repoName}) ${repoInfo ? "✅ Found" : "❌ Not synced yet"}\n\n**Recent Repositories:**\n${repos.map(r => `- [${r.name}](${r.html_url})`).join("\n")}`,
                type: "success",
            };
        }

        // List repositories
        if (action === "repos" || action === "repositories" || (action === "list" && parts[1] === "repos")) {
            const repos = await githubService.listRepositories({ perPage: 10 });
            return {
                text: `📁 **Your Repositories:**\n\n${repos.map(r => `- **${r.name}** ${r.private ? "🔒" : "🌐"} - ${r.description || "No description"}\n  ⭐ ${r.stargazers_count} | 🍴 ${r.forks_count} | [View](${r.html_url})`).join("\n\n")}`,
                type: "success",
            };
        }

        // List branches
        if (action === "branches" || (action === "list" && parts[1] === "branches")) {
            const branches = await githubService.listBranches(owner, repoName);
            return {
                text: `🌿 **Branches in ${owner}/${repoName}:**\n\n${branches.map(b => `- \`${b.name}\` ${b.protected ? "🔒" : ""}`).join("\n")}`,
                type: "success",
            };
        }

        // Create branch
        if (action === "create" && parts[1] === "branch") {
            const branchName = parts[2];
            if (!branchName) {
                return { text: "❌ Please specify a branch name: `@github create branch <name>`", type: "error" };
            }
            const fromBranch = parts[4] || "main";
            await githubService.createBranch(owner, repoName, branchName, fromBranch);
            return {
                text: `✅ **Branch Created**\n\nBranch \`${branchName}\` created from \`${fromBranch}\` in ${owner}/${repoName}`,
                type: "success",
            };
        }

        // List commits
        if (action === "commits" || (action === "list" && parts[1] === "commits")) {
            const commits = await githubService.listCommits(owner, repoName, { perPage: 5 });
            return {
                text: `📝 **Recent Commits in ${owner}/${repoName}:**\n\n${commits.map(c => `- \`${c.sha.substring(0, 7)}\` - ${c.commit.message.split("\n")[0]}\n  by ${c.commit.author.name} on ${new Date(c.commit.author.date).toLocaleDateString()}`).join("\n\n")}`,
                type: "success",
            };
        }

        // List pull requests
        if (action === "prs" || action === "pulls" || (action === "list" && (parts[1] === "prs" || parts[1] === "pulls"))) {
            const prs = await githubService.listPullRequests(owner, repoName);
            if (prs.length === 0) {
                return { text: `📋 **No open pull requests in ${owner}/${repoName}**`, type: "info" };
            }
            return {
                text: `📋 **Open Pull Requests in ${owner}/${repoName}:**\n\n${prs.map(pr => `- #${pr.number} **${pr.title}**\n  ${pr.user.login} → \`${pr.base.ref}\` | [View](${pr.html_url})`).join("\n\n")}`,
                type: "success",
            };
        }

        // List issues
        if (action === "issues" || (action === "list" && parts[1] === "issues")) {
            const issues = await githubService.listIssues(owner, repoName);
            if (issues.length === 0) {
                return { text: `📋 **No open issues in ${owner}/${repoName}**`, type: "info" };
            }
            return {
                text: `🐛 **Open Issues in ${owner}/${repoName}:**\n\n${issues.map(issue => `- #${issue.number} **${issue.title}**\n  by ${issue.user.login} | ${issue.labels.map(l => `\`${l.name}\``).join(" ")} | [View](${issue.html_url})`).join("\n\n")}`,
                type: "success",
            };
        }

        // Create issue
        if (action === "create" && parts[1] === "issue") {
            // Extract title from quotes or rest of command
            const titleMatch = command.match(/"([^"]+)"/);
            const title = titleMatch ? titleMatch[1] : parts.slice(2).join(" ");
            if (!title) {
                return { text: "❌ Please specify an issue title: `@github create issue \"Title\"`", type: "error" };
            }
            const issue = await githubService.createIssue(owner, repoName, title);
            return {
                text: `✅ **Issue Created**\n\n#${issue.number} - ${issue.title}\n[View Issue](${issue.html_url})`,
                type: "success",
            };
        }

        // Help command
        if (action === "help" || !action) {
            return {
                text: `🔧 **GitHub Commands:**\n
| Command | Description |
|---------|-------------|
| \`@github push [msg]\` | Push project to GitHub (creates repo if needed) |
| \`@github pull\` | Pull latest changes from GitHub |
| \`@github status\` | Get connection status and user info |
| \`@github repos\` | List your repositories |
| \`@github branches\` | List branches |
| \`@github commits\` | Show recent commits |
| \`@github prs\` | List open pull requests |
| \`@github issues\` | List open issues |
| \`@github create branch <name>\` | Create a new branch |
| \`@github create issue "title"\` | Create a new issue |
| \`@github help\` | Show this help message |
`,
                type: "info",
            };
        }

        // Unknown command
        return {
            text: `❓ Unknown command: \`${action}\`\n\nType \`@github help\` to see available commands.`,
            type: "warning",
        };

    } catch (error) {
        console.error("GitHub command error:", error);
        return {
            text: `❌ **GitHub Error**\n\n${error.message}\n\nMake sure your GitHub token is valid and has the required permissions.`,
            type: "error",
        };
    }
}

/**
 * Test GitHub connection
 */
export async function testConnection() {
    try {
        const user = await githubService.getUser();
        console.log("GitHub connection successful:", user.login);
        return { success: true, user: user.login };
    } catch (error) {
        console.error("GitHub connection failed:", error.message);
        return { success: false, error: error.message };
    }
}

export default githubService;
