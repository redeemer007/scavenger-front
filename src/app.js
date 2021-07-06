const xlsx = require('xlsx');
//const process = require('process');

const filePath = process.argv.slice(2)[0];
const workbook = xlsx.readFile(filePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

const posts = [];
let post = {};

for (let cell in worksheet) {
    const cellAsString = cell.toString();

    if (cellAsString[1] !== 'r' && cellAsString !== 'm' && cellAsString[1] > 1) {
        if (cellAsString[0] === 'A') {
            post.institutionName = worksheet[cell].v;
        }
        if (cellAsString[0] === 'B') {
            post.branchName = worksheet[cell].v;
        }
        if (cellAsString[0] === 'C') {
            post.address = worksheet[cell].v;
        }
        if (cellAsString[0] === 'D') {
            post.city = worksheet[cell].v;
        }
        if (cellAsString[0] === 'E') {
            post.contactNumber = worksheet[cell].v;
        }
        if (cellAsString[0] === 'F') {
            post.branchIncharge = worksheet[cell].v;
        }
        if (cellAsString[0] === 'G') {
            post.pincodeCovered = worksheet[cell].v;
            posts.push(post);
            post = {};
        }
    }
}

console.log(posts);