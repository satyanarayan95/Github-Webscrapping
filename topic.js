let request=require("request");
let cheerio=require("cheerio");
let repoPageObj=require("./extractRepoLinks");
request("https://github.com/topics",cb);

function cb(err,response,html){
   if(err){
       console.log(err);
   }
   else{
       extractTopics(html);
   }
}

function extractTopics(html){
    let chSelector=cheerio.load(html);
    let topics=chSelector(".topic-box.position-relative.hover-grow.height-full.text-center.border.color-border-secondary.rounded.color-bg-primary.p-5");
    console.log(topics.length);
    for(let i=0;i<topics.length;i++){
        let topicName=chSelector(topics[i]).find(".f3.lh-condensed.text-center.Link--primary.mb-0.mt-1").text();
        let link=chSelector(topics[i]).find(".no-underline.d-flex.flex-column.flex-justify-center").attr("href").split("/");
        link=link[2];
        let fullLink="https://github.com/topics/"+link;
        repoPageObj.extractRepoLinks(fullLink,topicName);
    }
}
