class queueNode {
    constructor(name, user, link, length) {
        this.title = name;
        this.requestBy = user;
        this.link = link;
        this.length = length;
    }
}
function timeFormat(seconds) {
    let hrs = ~~(seconds / 3600);
    let mins = ~~((seconds % 3600) / 60);
    let secs = ~~seconds % 60;

    var out = "";

    if (hrs > 0) {
        out += hrs + ":" + (mins < 10 ? "0" : "");
    };

    out += mins + ":" + (secs < 10 ? "0" : "");
    out += secs;
    return out;
};

module.exports.queueNode = queueNode;
module.exports.sToT = timeFormat;