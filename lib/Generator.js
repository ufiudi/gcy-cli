const {getRepoList,getTagList} = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const path = require('path')
const downloadGitRepo = require('download-git-repo') // 不支持 Promise

// 添加加载动画
async function wrapLoading(fn,message,...agrs){
    // 使用 ora 初始化，传入提示信息 message
    const spinnre = ora(message)

    // 开始加载动画
    spinnre.start()

    try {
        const result = await fn(...agrs)

        // 状态为修改为失败
        spinnre.succeed()

        return result

        //状态修改成功
    } catch (error) {
        console.log(error)
        // 状态为修改为失败
        spinnre.fail('request failed, refetch ....')
        
    }
}

class Generator {
    constructor(name,targetDir){
        this.name = name
        this.targetDir = targetDir

        // 对 download-git-repo 进行 promise 化改造
        this.downloadGitRepo = util.promisify(downloadGitRepo)

    }

    async download(repo,tag){
        //拼接下载地址
        const requestUrl = `zhurong-cli/${repo}${tag?'#'+tag:''}`

        await wrapLoading(this.downloadGitRepo,'waiting download template',requestUrl,path.resolve(process.cwd(),this.targetDir))
    }

    async getTag(repo){
        const tags = await wrapLoading(getTagList,'waiting fetch tag',repo)

        if(!tags) return

        // 过滤我们需要的 tag 名称
        const tagsList = tags.map(item => item.name);

          // 2）用户选择自己需要下载的 tag
        const { tag } = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tagsList,
            message: 'Place choose a tag to create project'
        })

        return tag
    }


    async getRepo(){
        const repoList = await wrapLoading(getRepoList,'waiting fetch template')

        if(!repoList) return

        //过滤我们需要的模板名称
        const reqos = repoList.map(item => item.name)

        // 2）用户选择自己新下载的模板名称
        const { repo } = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: reqos,
            message: 'Please choose a template to create project'
        })

        return repo
    }

    // 获取用户选择的模板
    // 1）从远程拉取模板数据
    // 2）用户选择自己新下载的模板名称
    // 3）return 用户选择的名称

    async create(){
        const reqo = await this.getRepo()

        // 2) 获取 tag 名称
        const tag = await this.getTag(reqo)

        // 3）下载模板到模板目录
        await this.download(reqo, tag)
        
        // console.log('用户选择了,repo ' + reqo , 'tag ' + tag)

        // 4）模板使用提示
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  npm run dev\r\n')
    }

}
module.exports = Generator