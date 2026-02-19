const path = require("path");
const fs = require("fs-extra");
const simpleGit = require("simple-git");

const WORKSPACE_DIR = path.join(process.env.HOME || "", ".openclaw", "workspace");

async function publishToGitHub({ projectPathRelative, repoUrl, branch = "main", message = "publish" }) {
  if (!projectPathRelative || !repoUrl) throw new Error("projectPathRelative and repoUrl required");

  const projectDir = path.join(WORKSPACE_DIR, projectPathRelative);
  await fs.ensureDir(projectDir);

  const git = simpleGit(projectDir);

  const isRepo = await fs.pathExists(path.join(projectDir, ".git"));
  if (!isRepo) await git.init();

  // Ensure remote
  const remotes = await git.getRemotes(true);
  const hasOrigin = remotes.some(r => r.name === "origin");
  if (!hasOrigin) await git.addRemote("origin", repoUrl);

  await git.add(".");
  // Commit only if there are changes
  const st = await git.status();
  if (st.files.length) await git.commit(message);

  // Ensure branch exists locally
  await git.checkoutLocalBranch(branch).catch(async () => {
    await git.checkout(branch).catch(async () => {
      await git.checkoutLocalBranch(branch);
    });
  });

  await git.push("origin", branch, { "--set-upstream": null });
  return { ok: true, projectDir, branch };
}

async function pullFromGitHub({ projectPathRelative, repoUrl, branch = "main" }) {
  if (!projectPathRelative || !repoUrl) throw new Error("projectPathRelative and repoUrl required");

  const projectDir = path.join(WORKSPACE_DIR, projectPathRelative);
  const gitDir = path.join(projectDir, ".git");

  const exists = await fs.pathExists(projectDir);
  const isRepo = exists && await fs.pathExists(gitDir);

  if (!exists) await fs.ensureDir(projectDir);

  if (!isRepo) {
    // Clone into empty directory
    await fs.emptyDir(projectDir);
    await simpleGit().clone(repoUrl, projectDir, ["--branch", branch]);
    return { ok: true, action: "cloned", projectDir, branch };
  }

  const git = simpleGit(projectDir);
  // Ensure origin url is correct
  const remotes = await git.getRemotes(true);
  const origin = remotes.find(r => r.name === "origin");
  if (!origin) await git.addRemote("origin", repoUrl);

  await git.fetch("origin", branch);
  await git.checkout(branch).catch(async () => {
    await git.checkoutLocalBranch(branch);
  });

  await git.pull("origin", branch);
  return { ok: true, action: "pulled", projectDir, branch };
}

module.exports = { publishToGitHub, pullFromGitHub };
