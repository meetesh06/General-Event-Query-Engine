import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormControlLabel, FormGroup, Input, Paper, TextField } from '@mui/material';
import { Container, margin } from '@mui/system';
import Checkbox from '@mui/material/Checkbox';
const jsonata = require('jsonata');
import { JSONTree } from 'react-json-tree';


const cColors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080']

function getRandomColor(n) {
  return cColors[n];
}

// function getRandomColor(n) {
//   const rgb = [0, 0, 0];
//   for (let i = 0; i < 24; i++) {
//       rgb[i%3] <<= 1;
//       rgb[i%3] |= n & 0x01;
//       n >>= 1;
//   }
//   return '#' + rgb.reduce((a, c) => (c > 0x0f ? c.toString(16) : '0' + c.toString(16)) + a, '');
// }

let colIter = 0

// function getRandomColor(number) {
//   const goldenAngle = 180 * (3 - Math.sqrt(5))

//   const hue = number * goldenAngle + 60; // use golden angle approximation
//   return `hsl(${hue},100%,75%)`;
// }

// function getRandomColor(colorNum, lightness){
//   let hues = [0, 20, 30, 40, 50, 60, 80, 120, 160, 190, 210, 230, 260, 290, 330, 360];
//   //hues = [...Array(37).keys()].map(x=>x*10);
//   let lights = [60, 50, 50, 50, 50, 50, 50, 55, 50, 55, 67, 77, 73, 67, 60, 60];
//   let goldenFrac = 0.5 * (3 - Math.sqrt(5));
//   let x = (colorNum * goldenFrac % 1.0) * (hues.length - 1);
//   //x=colorNum%(hues.length-1); // for point visualisation
//   let i = Math.floor(x);
//   let f = x % 1.0;
//   let hue = (1.0 - f) * hues[i] + f * hues[i + 1];
//   let light = (1.0 - f) * lights[i] + f * lights[i + 1];
//   return "hsl( " + Math.round(hue * 100) / 100 + ", 100%, "+Math.round(light * 100) / 100+"% )";
// }


const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};


const TimelineView = (props) => {
  const { timeline, pidList, colors, eventsTypes } = props
  const [eventsTypesShown, setEventsTypesShown] =  React.useState([]);
  const [selectedEvent, setSelectedEvent] =  React.useState({});


  const updateSelectedEvents = (eType) => {
    let updated = [...eventsTypesShown]
    if (!updated.includes(eType)) {
      updated.push(eType)
    } else {
      var index = updated.indexOf(eType);
      if (index !== -1) {
        updated.splice(index, 1);
      }
    }
    setEventsTypesShown(updated)
  }

  
  

  return (
    <React.Fragment>
      <div style={{ alignContent: 'center', display: 'flex', justifyContent: 'center' }}>
        <FormGroup row>
          {
            eventsTypes.map((eType) => {
              return (
                <FormControlLabel 
                  key={`c-${eType}`}
                  style={{ borderStyle: 'solid',  borderColor: colors[eType], paddingLeft: 10, paddingRight: 10, margin: 5, display: 'inline'}}
                  key={eType}
                  control={<Checkbox />}
                  label={eType} 
                  checked={eventsTypesShown.includes(eType)}
                  onChange={(event) => {
                    updateSelectedEvents(eType)
                  }}
                  />
              )
            })
          }
        </FormGroup>

      </div>
      <div style={{ overflow: 'scroll', width: '100%'}}>
        {`Timeline contains ${timeline.length} events`}
        {
          pidList.map((pid) => {
            return <div style={{ display: 'flex' }} key={pid}>
              <div style={{ width: 100 }}>
                {pid}
              </div>
              <div>
                {
                  timeline.map((e) => {
                    if (eventsTypesShown.includes(e.eventType)) {
                      if (e.pid == pid) {
                        return (
                          <span
                            onClick={ ()=> setSelectedEvent(e) }
                            style={{ 
                                borderStyle: selectedEvent === e ? 'solid' : undefined, 
                                borderWidth: 2,
                                borderColor: selectedEvent === e ? colors[e.eventType] : undefined,
                                padding: 2, 
                                cursor: 'pointer', 
                                marginRight: 2, 

                                // height: 50, 
                                backgroundColor: selectedEvent === e ? "black" : colors[e.eventType]
                              }}>&nbsp;</span>
                        );
                      } else {
                        return  (
                          <span
                            // onClick={ ()=> setSelectedEvent(e) }
                            style={{ 
                              // borderStyle: selectedEvent === e ? 'solid' : undefined, 
                              padding: 2, 
                              marginRight: 2, 
                              // height: 50, 
                              // backgroundColor: colors[e.eventType]
                              }}>&nbsp;</span>
                        )
                      }
                    }
                  })

                }

              </div>


            </div>
          })
        }
      </div>
      <div style={{ flex: 1 }}>
        <h3>Selected Event</h3>
        {
          <JSONTree theme={theme} invertTheme={true}  data={selectedEvent} />
        }
      </div>
      
    </React.Fragment>
  )
}

const DataView = (props) => {
  const { timeline, pidList, colors, eventsTypes } =  props;
  // const [mainAggregateQuery, setMainAggregateQuery] =  React.useState("");
  const [mainAggregateResult, setMainAggregateResult] =  React.useState({});
  const [auxiliaryTimeline, setAuxiliaryTimeline] =  React.useState(false);

  const mainAggregateQueryRef = React.useRef();
  // const showRefContent = () => {
  //   console.log(mainAggregateQueryRef.current.value);
  // };


  return (
    <Paper sx={{margin: 5, padding: 2}} elevation={5}>
      <TimelineView timeline={timeline} pidList={pidList} colors={colors} eventsTypes={eventsTypes}/>

      <div>
        <h3>Query</h3>
        <b>Cheatsheet</b> <br/>
        Compilation time: <b>
          $sum(timeline[eventType="pirCompilation"].time)
        </b> <br/>
        Number of X events: <b>
          $sum(timeline[eventType="X"])
        </b> <br/>
        Number of X events for where M=V: <b>
          $sum(timeline[eventType="X" and M="V"])
        </b> <br />
        
        Give list of dispatch events that happend for before this compilation: 
        <b>
          timeline[timestamp {"<"} TIMESTAMP and eventType="dispatch" and hast="HAST"]
        </b> <br />

        See all dispatch events leading up to a compilation 
        <b>
        {`$sort(timeline[timestamp <= 1679782893927526000 and eventType!="l2check"  and hast="NS:base:13807296501490167129"], function($l, $r) {   $l.timestamp > $r.timestamp })`}
        </b> <br />

        <b>
          {`$sort(timeline[timestamp >= 1679782923452549000 and eventType!="l2check" and vtab="0x564e53471580"], function($l, $r) { $l.timestamp > $r.timestamp })`}
        </b>
        <TextField
          fullWidth
          label="Query"
          inputRef={mainAggregateQueryRef}
          // value={mainAggregateQuery}
          // onChange={(event) => {
          //   setMainAggregateQuery(event.target.value);
          // }}
        />
        <FormGroup>
          <FormControlLabel 
            control={<Checkbox />}
            label={"Show Auxiliary Timeline"} 
            checked={auxiliaryTimeline}
            onChange={(event) => {
              setAuxiliaryTimeline(!auxiliaryTimeline)
            }}
            />
          <Button 
            onClick={() => {
              (async () => {
                // showRefContent()
                setAuxiliaryTimeline(false)
                try {
                  const expression = jsonata(mainAggregateQueryRef.current.value);
                  const result = await expression.evaluate({timeline: timeline});
                  setMainAggregateResult(result)
                } catch(c) {
                  setMainAggregateResult(c)
                }

                // console.log("mainAggregateResult", result)
                // return result
              })()
            }}
            variant="text">Execute</Button>

        </FormGroup>
        {
          auxiliaryTimeline && <TimelineView timeline={mainAggregateResult} pidList={pidList} colors={colors} eventsTypes={eventsTypes}/>
        }
        <div style={{ flex: 1 }}>
        <h3>Query Result</h3>
        <JSONTree theme={theme} invertTheme={true}  data={mainAggregateResult} />
        </div>

      </div>

      <div>
        
      </div>
    </Paper>
  )
}

export default function Main() {
  const [currData, setCurrData] = React.useState([]);
  const [pidList, setPidList] = React.useState([]);
  const [colorsList, setColorsList] = React.useState([]);
  const [colors, setColors] = React.useState({});
  const [eventsTypes, setEventsTypes] = React.useState([]);

  const refreshColors = (parsed) => {
    
    const pids = {}
    const colors = {}
    const cList = []
    const pList = []
    const eTypes = []
    parsed.forEach((element,index) => {
      if (!(element.eventType in colors)) {
        colors[element.eventType] = getRandomColor(colIter++)
        cList.push([element.eventType, colors[element.eventType]])
        eTypes.push(element.eventType)
      }
  
      if (element.pid in pids) {
        return
      }
      pList.push(element.pid)
      pids[element.pid] = 1
      
    });
    setPidList(pList)
    setColorsList(cList)
    setColors(colors)
    setEventsTypes(eTypes)
  }

  const onLoad = function (event){
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var content = reader.result;
      const parsed = JSON.parse(content)
      setCurrData(parsed);
      refreshColors(parsed)
    }
    
    reader.readAsText(file);    
  }
   

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              General Event Query Engine
            </Typography>
            <Input 
              type='file' label='Upload' accept='.csv'
              onChange={onLoad} 
            />

            <Button onClick={() => refreshColors(currData)} color="inherit">Refresh Colors</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <DataView timeline={currData} pidList={pidList} colorsList={colorsList} colors={colors} eventsTypes={eventsTypes} />
      
    </div>
  );
}