import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, PureComponent } from "react";
import io from 'socket.io-client'; // Import the socket.io client library
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { Gauge } from '@mui/x-charts/Gauge';
import { GaugeComponent } from 'react-gauge-component';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, ResponsiveEmbed,Toast,Button,ToastContainer } from 'react-bootstrap';
import { Sparklines, SparklinesLine, SparklinesSpots, SparklinesReferenceLine } from 'react-sparklines';
import Alert from 'react-bootstrap/Alert';
import Speech from 'react-speech';
// Establish a socket connection to the server at the specified URL
const socket = io.connect('http://localhost:5050');

function App()  {
  const [smk , setsmk] = useState();
  const [hum, sethum] = useState();
  const [arr ,setarr] = useState([]); 
  const [temp ,settemp] = useState();
  const [smkarr, setsmkarr] = useState([]);
  const [humarr, sethumarr] = useState([]);
 const [v1 , setv1] = useState();
 const [v2 , setv2] = useState();
 const [s ,sets] = useState();
 const vm = 22.4;
 const m = 44;
 const [ pred , setpred] = useState();

  
 // let avr = [];
 const url = "http://localhost:5050/params";
 async function gettemp () {
  try {
    const response = await fetch(url);
    if (!response.ok){
      throw new Error(`res status : ${response.status}`);
    }
    const res = await response.json();
    //console.log( res[100].temp);
   for (let i = 0; i < res.length; ++i){
    settemp([...temp,res[i].temp]);
   }
      
      //const temp = res.map((item)=> item.temp.reduce((a,b)=> a + b) / res.length, res)
     
      //setcrdate(res.createdAt); 
  } catch (error) {
    console.error(error);
  }
 }
  useEffect(() => {
    gettemp();
    // Listen for incoming messages from the server
    socket.on("receive_message", (s,h,t) => {
      setsmk(s);
      sethum(h);
      settemp(Number(t));

      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      
     // setavrg(avg);
       if (arr.length >=  8){
          let avr = [...arr];
          let srr= [...smkarr];
          let hrr = [...humarr];
          avr.shift();
          srr.shift();
          hrr.shift();
          setarr(avr);
          setsmkarr(srr);
          sethumarr(hrr);
        }else{
            setarr([...arr, t]);
            arr.push(t);
            setsmkarr([...smkarr, s]);
            smkarr.push(s);
            sethumarr([...humarr,h]);
            humarr.push(h);
            
        }
        /*const sum = humarr.sort((a,b) => a - b );
        const avg = (sum / humarr.length);
        setconfac(avg);*/
    });

    // Cleanup the effect by removing the event listener when the component unmounts
    return () => {
      socket.off("receive_message");
    };
  }, [arr]); // Empty dependency array ensures this runs only once when the component mounts
  const msgs = () => {
   const msg = new SpeechSynthesisUtterance()
   msg.text = "Be alert, the threshold has been exceeded"
   window.speechSynthesis.speak(msg)
  }
    const msgh = () => {
      const msg1 = new SpeechSynthesisUtterance()
      msg1.text = "Be alert, the threshold has been exceeded"
      window.speechSynthesis.speak(msg1)
    }
    const msgc = () => {
      const msg2 = new SpeechSynthesisUtterance()
      msg2.text = "Be alert, the threshold has been exceeded"
      window.speechSynthesis.speak(msg2)
    }
  const ih = Number(hum);
  const is = Number(smk);
  const it = Number(temp);
  
    const calc = () => {
    const  tv = ( Number(v1) - Number(v2)) / Number(vm);
     const ms = Number(m)/Number(s); 
     const  tt = 273 / temp;
      const coa = smk * .27
     let pr =  coa * tv * ms * tt
      setpred(pr);
    }
  return ( 
    <>
    <Row>
      <Col md={6} className="mb-2">
      <ToastContainer
          className="p-3"
          position={'middle-start'}
          style={{ zIndex: 1 }} >
        <Toast >
          <Toast.Header>
            <strong className="me-auto">Smoke :</strong>
            <small>{is} ppm </small>
          </Toast.Header>
          <Toast.Body>
          {is > 99 ? <> <Alert variant='danger'> Be alert, the threshold has been exceeded</Alert> </> : ""}
          <Sparklines data={smkarr} margin={6}>
           <SparklinesLine style={{ strokeWidth: 3, stroke: "red", fill: "none" }} />
           <SparklinesSpots size={4} style={{ stroke: "#336aff", strokeWidth: 3, fill: "white" }} />
           <SparklinesReferenceLine type="min" />
          </Sparklines>
      </Toast.Body>
        </Toast>
        </ToastContainer>
      </Col>
    <Col md={6} className="mb-2">
    <ToastContainer
          className="p-3"
          position={'middle-center'}
          style={{ zIndex: 1 }}>
        <Toast >
          <Toast.Header>
            <strong className="me-auto">Temprature:</strong>
            <small>{temp} C</small>
          </Toast.Header>
          <Toast.Body>
          {it > 36? <> <Alert variant='danger'> Be alert, the threshold has been exceeded</Alert> </> : ""}
          <Sparklines data={arr} margin={6}>
           <SparklinesLine style={{ strokeWidth: 3, stroke: "red", fill: "none" }} />
           <SparklinesSpots size={4} style={{ stroke: "#336aff", strokeWidth: 3, fill: "white" }} />
           <SparklinesReferenceLine type="min" />
          </Sparklines>
      </Toast.Body>
        </Toast>
        </ToastContainer>
      </Col>
      <Col md={6} className="mb-2">
      <ToastContainer
          className="p-3"
          position={'middle-end'}
          style={{ zIndex: 1 }} >
        <Toast >
          <Toast.Header>
          <strong className="me-auto">humidity :</strong>
            <small>{hum} %</small>
          </Toast.Header>
          <Toast.Body>
          {ih < 60 ? <><Alert variant='danger'>Be alert, the threshold has been exceeded</Alert></>: ""}
          <Sparklines data={humarr} margin={6}>
           <SparklinesLine style={{ strokeWidth: 3, stroke: "red", fill: "none" }} />
           <SparklinesSpots size={4} style={{ stroke: "#336aff", strokeWidth: 3, fill: "white" }} />
           <SparklinesReferenceLine type="min" />
          </Sparklines>
      </Toast.Body>
      </Toast>
      </ToastContainer>
      </Col>
    </Row>  
    <div style={{width: 150, marginLeft: 20}}>
      <Row>
        <Col>
        <input placeholder='v1' onChange={(e) => setv1(e.target.value)} />
        </Col>
      <Col>
      <input placeholder='v2' onChange={(e) => setv2(e.target.value)}  />
      </Col>
      
      </Row>
      <Row>
      <input placeholder='s'  onChange={(e) => sets(e.target.value)}  />
      </Row>
    <Button  onClick={calc}>calculate</Button> 
    <p>prediction : {pred}</p>
    </div>   

</>
  );
}

export default App;
/*
 <Col md={6} className="mb-2">
      <ToastContainer
          className="p-3"
          position={'middle-start'}
          style={{ zIndex: 1 }} >
        <Toast >
          <Toast.Header>
            <strong className="me-auto">Temprature :</strong>
            <small>{receiveMessage} C</small>
          </Toast.Header>
          <Toast.Body>
          <Sparklines data={arr} margin={6}>
           <SparklinesLine style={{ strokeWidth: 3, stroke: "#336aff", fill: "none" }} />
           <SparklinesSpots size={4} style={{ stroke: "#336aff", strokeWidth: 3, fill: "white" }} />
           <SparklinesReferenceLine type="min" />
          </Sparklines>
      </Toast.Body>
        </Toast>
        </ToastContainer>
      </Col>

*/

// <div style={{width: 400,marginLeft:250, marginTop: 300}}>
// <div  style={{display: 'flex', flexDirection: 'row' , width: '100%', textAlign: 'center', fontSize:50}}> 
/*        <SparkLineChart
          data={arr}
          xAxis={{
            scaleType: 'time',
            data: [
              new Date(2022, 5, 1),
              new Date(2022, 5, 2),
              new Date(2022, 5, 5),
              new Date(2022, 5, 6),
              new Date(2022, 5, 7),
              new Date(2022, 5, 8),
              new Date(2022, 5, 11),
              new Date(2022, 5, 12),
            ],
            valueFormatter: (value) => value.toISOString().slice(0, 10),
          }}
          height={100}
          showTooltip
          showHighlight
        />*/


        /*
        const kbitsToMbits = (value) => {
      return value + ' m/s';
  }
        <GaugeComponent
            type="radial"
              arc={{
                subArcs: [
                  {
                    limit: .020,
                    color: '#5BE12C',
                    showTick: true,
                  },
                  {
                    limit: .040,
                    color: '#F5CD19',
                    showTick: true
                  },
                  {
                    limit: .060,
                    color: '#F58B19',
                    showTick: true
                  },
                  {
                    limit: .1,
                    color: '#EA4228',
                    showTick: true
                  },
                ]
              }}
              pointer={{
                elastic: true,
                animationDelay: 0
              }}
              labels={{
                valueLabel: {
                  style: {fontSize: 40},
                  formatTextValue: kbitsToMbits
                },}}
              value={vib}
              minValue={0}
              maxValue={.1}
            />*/

            /*
             <GaugeComponent
              type="semicircle"
              arc={{
                colorArray: ['#00FF15', '#FF2121'],
                padding: 0.02,
                subArcs:
                  [
                    { limit: 40 },
                    { limit: 60 },
                    { limit: 70 },
                    {},
                    {},
                    {},
                    {}
                  ]
              }}
              pointer={{type: "blob", animationDelay: 0 }}
              value={hum}
            />*/