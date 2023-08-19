const axios = require("axios");

const http = new axios.Axios();

axios.interceptors.response.use((res) => res.data);

function getRepoList() {
  return axios.get("https://api.github.com/orgs/Q-cli/repos");
}

/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/Q-cli/${repo}/tags`);
}

module.exports = {
  getRepoList,
  getTagList,
};
