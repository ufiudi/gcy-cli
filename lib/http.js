//通过 axios 处理请求
const axios = require('axios')

axios.interceptors.response.use(res => {
    return res.data;
})

async function getRepoList(){
    return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
}


async function  getTagList(repo) {
  return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
}


module.exports = {
    getRepoList,
    getTagList
}
