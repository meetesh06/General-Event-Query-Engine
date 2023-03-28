const args = process.argv;
const eventLog = args[2];
var eventLogFolder = require('path').dirname(eventLog);
const outputPath = args[3];
const fs = require('fs');

let content = fs.readFileSync(eventLog,  'utf8')
const lines = content.split("\n")
const timeline = []
lines.forEach((line) => {
  line = line.split(",")
  if (line.length != 5) return
  const curr = {}
  curr["timestamp"] = line[0];
  curr["eventType"] = line[1];
  curr["time"] = line[2];
  curr["pid"] = line[3];
  curr["uri"] = line[4];
  let fLoad = fs.readFileSync(eventLogFolder + "/" + curr["uri"])
  let jFile = JSON.parse(fLoad);
  curr["data"] = jFile;
  timeline.push(curr)
});

let data = JSON.stringify(timeline);
fs.writeFileSync(outputPath, data);
