#! /usr/bin/env node

const program = require('commander');
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const packageConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../package.json')));

let {version,config} = packageConfig;
// console.log('process.cwd',process.cwd());

program
.version(`${version}`,'-v,--version')
.option('-i,--init <type>','init template type')
.parse(process.argv);

function inquirerAppInfo(templateType,appName){
    inquirer.prompt([
        {
            type: 'input',
            name: appName,
            message: '项目名称',
        }  
    ]).then(res=>{
        // console.log(res[appName]);
        if(res[appName]){
           
            //判断是否存在
            let destination = path.resolve(process.cwd(),res[appName]);
            // console.log('destination',destination)
            if(fs.existsSync(destination)){
                console.log(chalk.red('文件已存在，创建失败！'))
            }else{
                const spinner = ora({
                    text:'downloading',
                    prefixText:'----',
                    spinner:'pipe',
                    color:'red',
                }).start();

                let radom = 'temp';
                download(`direct:${config.templateUrl}`,path.resolve(process.cwd(),radom),{clone:true},err=>{
                    if(err){
                        console.log(err);
                        spinner.fail('模板拉取失败！')
                    }else{
                        spinner.succeed('模板下载成功！');
                        let target = path.join(process.cwd(),radom,templateType);
                        // console.log("target",target);
                        // let destination = path.resolve(process.cwd(),appName);
                        fse.moveSync(target,destination);
                        fse.removeSync(path.join(process.cwd(),radom))
                        spinner.start();
                        spinner.succeed('创建完成');
                    }
                    process.exit();
                })
            }

           
        }else{

        }
    })
}

if(program.init=='vue'){
    inquirerAppInfo(program.init,'name');
}else if(program.init=='reacet'){
    inquirerAppInfo(program.init,'name');
}else{
    console.log(chalk.red('请选择初始模板类型vue或者react'))
}






