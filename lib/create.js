const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator = require('./Generator')

module.exports = async function(name, options) {
	console.log('>>>create.js', name, options)
	//执行创建命令

	//当前创建的目录地址
	const cwd = process.cwd()

	//需要创建的目录地址
	const targetAir = path.join(cwd, name)

	//目录是否存在
	if (fs.existsSync(targetAir)) {
		//存在
		if (options.force) {
			//存在是 是否强制创建

			await fs.remove(targetAir)
		} else {

			//询问是否确定覆盖
			let {
				action
			} = await inquirer.prompt([
				{
					name: 'action',
					type: 'list',
					message: 'Target directory already exists Pick an action:',
					choices: [{
						name: 'Overwrite',
						value: 'overwrite'
					}, {
						name: 'Cancel',
						value: false
					}]
				}

			])
			
			console.log('action',action)
			
			if(!action){
				return
			}else if(action === 'overwrite'){
				console.log(`\r nRemoving...`)
				await fs.remove(targetAir)
			}

		}
	}

	// 创建项目
	const generator = new Generator(name, targetAir);

	// 开始创建项目
	generator.create()
}
