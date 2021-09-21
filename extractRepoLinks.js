let request = require("request");
let cheerio = require("cheerio");
 let fs=require("fs");
 let path=require("path");

function extractRepoLinks(url){
    request(url,cb);
    console.log(url);
}
 

function cb(err,response,html){
    if(err){
        console.log(err);
    }
    else{
        extractdata(html);
    }
    
}
function dirCreater(src){
    if(fs.existsSync(src)==false){
        fs.mkdirSync(src);
    }
}

function createFile(filePath){
    if(fs.existsSync(filePath)==false){
        fs.openSync(filePath,"w");
    }
}

function extractdata(html){
    let chSelector=cheerio.load(html);
    let topicElementArr=chSelector("h1");
    let topicName=chSelector(topicElementArr[0]).text().trim().split("\n")[0];
    let pathOfFolder=path.join(__dirname,topicName);
    dirCreater(pathOfFolder);
    let  reposLinkArr=chSelector(".f3.color-text-secondary.text-normal.lh-condensed");
    for(let i=0;i<8;i++){
        let aArr=chSelector(reposLinkArr[i]).find("a");
        let repoLink=chSelector(aArr[1]).attr("href");
        console.log(repoLink);
        let fileName=repoLink.split("/").pop();
        let filePath=path.join(pathOfFolder,fileName+".json");
        createFile(filePath);
        let issuPageLink="https://github.com"+repoLink+"/issues";
        getIssuesData(issuPageLink,filePath);
    }
    console.log("'''''''''''''''''''''''''");
}
function getIssuesData(url,filepath){
    request(url,issuePageCb);
    function issuePageCb(err,response,html){
        if(err){
            console.log(err);
        }
        else{
            extractIssues(html);
        }
    }
    function extractIssues(html){
        let chSelector=cheerio.load(html);
    let arr=[];
    let issueAnchorArr=chSelector(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
    for(let i=0;i<issueAnchorArr.length;i++){
        let link=chSelector(issueAnchorArr[i]).attr("href");
        let issueName=chSelector(issueAnchorArr[i]).text();
        let issueObj={
            link:link,
            issueName:issueName
        }
        arr.push(issueObj);
    }
    console.table(arr);
    }
}
module.exports={
    extractRepoLinks:extractRepoLinks
}


