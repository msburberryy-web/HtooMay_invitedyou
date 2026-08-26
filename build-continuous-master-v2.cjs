const sharp = require('sharp');
const path = require('path');

const W = 1280;
const H = 10020;
const overlap = 150;
const zones = [
  ['assets/backgrounds/main-chapter-01-opening.png', 0, 1050],
  ['assets/backgrounds/chapter-02-welcome.png', 900, 1250],
  ['assets/backgrounds/chapter-03-plan.png', 2000, 1450],
  ['assets/backgrounds/continuous/story-records-continuation.png', 3300, 2300],
  ['assets/backgrounds/continuous/plan-information-continuation.png', 5450, 2400],
  ['assets/backgrounds/continuous/finale-continuation.png', 7700, 2320]
];

async function feathered(file, height, first, last) {
  const image = await sharp(file).resize(W, height, {fit:'cover', position:'centre'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {data, info} = image;
  for (let y = 0; y < info.height; y++) {
    let a = 1;
    if (!first && y < overlap) a = y / overlap;
    if (!last && y > info.height - overlap) a = Math.min(a, (info.height - y) / overlap);
    for (let x = 0; x < info.width; x++) data[(y * info.width + x) * 4 + 3] = Math.max(0, Math.min(255, Math.round(255 * a)));
  }
  return sharp(data, {raw:info}).png().toBuffer();
}

(async()=>{
  const layers=[];
  for (let i=0;i<zones.length;i++) {
    const [file, top, height]=zones[i];
    layers.push({input:await feathered(path.join(__dirname,file),height,i===0,i===zones.length-1),top,left:0});
  }
  await sharp({create:{width:W,height:H,channels:4,background:'#fbf4e8'}})
    .composite(layers)
    .webp({quality:92, smartSubsample:true})
    .toFile(path.join(__dirname,'assets/backgrounds/continuous/main-style-overlay-proof-v2.webp'));
  console.log('assets/backgrounds/continuous/main-style-overlay-proof-v2.webp');
})();
