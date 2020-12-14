function run() { 
    //Requires
    const readdirSync = require('fs').readdirSync;
    const resolve = require('path').resolve;
    let JSONTemplate = require('../utilities/JSONTemplate.js');
    //Read files from path
    let path = resolve("./data");
    let files=readdirSync(path).filter(f => f.split(".").pop() == "json");
    let loadStr = '[JSON]';
    let data = {};
    //Print to console
    if (files.length<=0) console.log(`${loadStr.red.bold} No JSON files to load.\n`);
    else {
        console.log(`${loadStr.red.bold} ${files.length} JSON files detected.`);
        //Load each json file
        files.forEach((f, i)=> {
            let fp = `${path}/${f}`
            let props = require(fp);
            let loaded = `${f.toString()} loaded!`;
            console.log(`${loadStr.red.bold} [${i+1}] ${loaded.red}`);
            data[f]={fp: fp, data: props};
        });
        console.log(`${loadStr.red.bold} All JSON files have been loaded!\n`); 
    }
    return data;
}
module.exports = run;


