class Log {
    constructor(err, fp) {
        this.date = new Date();
        this.err = err;
        this.content = '';
        this.title = '';
        this.folder = fp;
        this.writeFileSync = require('fs').writeFileSync;
    }
    write(fileName) {
        this.writeFileSync(`${folder}\\${fileName}.txt`, this.content);
    }
    create() {
    	this.title = `${this.date.getDay()}/${this.date.getMonth()}/${this.date.getFullYear()}`;
    	if(this.err.error.status == 403) this.content = 'The bot has run out of quota for the day...';
    	this.content += `${this.err}`;
    	this.write(this.title);
    }
}
module.exports = Log;