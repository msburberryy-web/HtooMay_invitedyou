const sharp=require('sharp');
const path=require('path');
const W=1280,H=10020,fade=385;
const zones=[
 ['assets/backgrounds/main-chapter-01-opening.png',0,1809],
 ['assets/backgrounds/chapter-02-welcome.png',1424,1923],
 ['assets/backgrounds/chapter-03-plan.png',2962,2710],
 ['assets/backgrounds/continuous/middle-matching-continuation.png',5287,2560],
 ['assets/backgrounds/continuous/final-matching-continuation.png',7460,2560]
];
async function layer(file,height,index){
 const {data,info}=await sharp(file).resize(W,height,{fit:'fill'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 for(let y=0;y<height;y++){
  let alpha=1;
  if(index>0&&y<fade)alpha=Math.min(alpha,y/fade);
  if(index<zones.length-1&&y>height-fade)alpha=Math.min(alpha,(height-y)/fade);
  for(let x=0;x<W;x++)data[(y*W+x)*4+3]=Math.max(0,Math.min(255,Math.round(255*alpha)));
 }
 return sharp(data,{raw:info}).png().toBuffer();
}
(async()=>{
 const layers=[];
 for(let i=0;i<zones.length;i++){const [file,top,height]=zones[i];layers.push({input:await layer(path.join(__dirname,file),height,i),top,left:0});}
 await sharp({create:{width:W,height:H,channels:4,background:'#fbf4e8'}}).composite(layers).webp({quality:94,smartSubsample:true}).toFile('assets/backgrounds/continuous/connected-originals-full-app.webp');
})();
