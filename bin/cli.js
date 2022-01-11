#! /usr/bin/env node

console.log('gcy cli working~')

const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')

program
.command('create <app-name>')
.description('create a new projec')
// -f or --force 为强制创建，如果创建的目录存在则直接覆盖
.option('-p --force','overwrite target directory if is exit')
.action((name,options) => {
	console.log('name',name,'options',options)
	
	const create = require('../lib/create')
	
	create(name,options)
})

// 配置 config 命令
program
.command('config <value>')
.description('inspect and modify the config')
.option('-g --get <path>','get value from option')
.option('-s --set <path> <value>')
.option('-d --delete <path>','delete option from config')
.action((value,options)=>{
	console.log(value,options)
})

// 配置 ui 命令
program
.command('ui')
.description('start add oprn roc-cli ui')
.option('-p --port <port>','Port used for the ui serve')
.action(option => {
	console.log(option)
})

program
.on('--help',()=>{
	// 使用 figlet 绘制 Logo
	console.log('\r\n' + figlet.textSync('gcycli', {
	  font: 'Ghost',
	  horizontalLayout: 'default',
	  verticalLayout: 'default',
	  width: 80,
	  whitespaceBreak: true
	}));
	
	
	
	//新增说明信息
	console.log(`\rnRun ${chalk.cyan(`gcy <command> --help`)} for detailed usage of given command\r\n`)
})

program
.version(`v${require('../package.json').version}`)
.usage('<command> [option]')

//解析用户执行命令参数
program.parse(process.argv)

