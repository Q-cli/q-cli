const { getRepoList, getTagList } = require("./http");
const ora = require("ora");
const inquirer = require("inquirer");
const util = require("util");
const downloadGitRepo = require("download-git-repo");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start();

  try {
    const result = await fn(...args);
    spinner.succeed();
    return result;
  } catch (error) {
    console.error(error);
    spinner.fail("request failed");
  }
}

class Generator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async getRepo() {
    const repoList = await wrapLoading(getRepoList, "waiting fetch template");
    if (!repoList) {
      return;
    }
    const repos = repoList.map((item) => item.name);

    const { repo } = await inquirer.prompt({
      name: "repo",
      type: "list",
      message: "please select a template",
      choices: repos,
    });
    return repo;
  }

  async getTag(repo) {
    try {
      const tags = await wrapLoading(getTagList, "waiting fetch tag", repo);
      if (!tags) {
        return;
      }
      const tagList = tags.map((item) => item.name);

      const { tag } = await inquirer.prompt({
        name: "tag",
        type: "list",
        message: "please select a tag",
        choices: tagList,
      });

      return tag;
    } catch (error) {
      throw error;
    }
  }

  async download(repo, tag) {
    const requestUrl = `Q-cli/${repo}${tag ? `#${tag}` : ""}`;

    await wrapLoading(
      this.downloadGitRepo,
      "waiting download template",
      requestUrl,
      path.resolve(process.cwd(), this.targetDir)
    );
  }

  async create() {
    try {
      console.log();
      const repo = await this.getRepo();
      console.log("choose repo", repo);
      const tag = await this.getTag(repo);
      console.log("choose tag", tag);
      await this.download(repo, tag);
      console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
      console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
      console.log(`\r\n  启动前请务必阅读 ${chalk.cyan("README.md")} 文件`);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Generator;
