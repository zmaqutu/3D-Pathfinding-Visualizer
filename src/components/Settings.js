import React,  { useState, useRef } from 'react'
import {  AwesomeButton, AwesomeButtonProgress } from 'react-awesome-button';
import "react-awesome-button/dist/styles.css";
import { Button, Select, MenuItem, Slider, TextField } from '@material-ui/core'
import { makeStyles, withStyles,} from '@material-ui/core/styles';
import { ReactComponent as SettingsLogo } from '../assets/settings.svg';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';



function Settings(props) {
    //function color_to_RGB_string(color){
	//	return `rgb(${color.r*255}, ${color.g*255}, ${color.b*255})`;
    //}
    //const trainTheAgent = props.trainAgent;

    /*useEffect(() => {
        if(props.trainAgent == true)
      }, [trainTheAgent ]);*/
    
    const [epochs, setEpochs] = useState(500000);
    const [startRow, setStartRow] = useState(5);
    const [startCol, setStartCol] = useState(5);
    const [finishRow, setFinishRow] = useState(25);
    const [finishCol, setFinishCol] = useState(25);
    const [finishPosition, setFinishPosition] = useState({});
    const [learningRate, setLearningRate] = useState(0.4);
    const [agentCuriosity,setAgentCuriosity] = useState(0.4);

    const useStyles = makeStyles((theme) => ({
        root: {
          '& > *': {
            margin: theme.spacing(1),
            background: '#1E88E5',
            border: 0,
            borderRadius: 3,
            color: 'white',
            width: '150px',
            height: '44px',
            'margin-left': '10px',
            'font-family': 'inherit',
            'font-weight': 600,
            'font-style': 'normal',
            
          },
        },
        slider: {
            marginTop: '15px',
            marginBottom: '10px',
            width: '150px',
            
        },
        startRow:{
            width:'75px',
            marginTop:'-15px',
            marginLeft: '-5px',
            marginBottom:'5px',



        },
        startCol:{
            width:'75px',
            marginTop:'-15px',
            marginLeft: '-75px',
            marginBottom:'5px',
            

        },
        finishRow:{
            width:'75px',
            marginBottom:'25px',
            marginLeft: '-5px',


        },
        finishCol:{
            width:'75px',
            marginBottom:'25px',
            marginLeft: '-75px',
            
        },
    }));
    const classes = useStyles();

    const muiTheme = createMuiTheme({
        overrides:{
          MuiSlider: {
            thumb:{
            color: "black",
            },
            track: {
              color: 'green'
            },
            rail: {
              color: 'black',
              
            }
          }
      },
      breakpoints:{

      }
    });

    const textBoxTheme = createMuiTheme({
        palette: {
          primary: green,
        },
    });
    function handleStartRowChange(e){
        e.target.value = Math.abs(e.target.value % 30);
        setStartRow(Number(e.target.value))

    }
    function handleStartColChange(e){
        e.target.value = Math.abs(e.target.value % 30);
        setStartCol(Number(e.target.value))
    }
    function handleFinishRowChange(e){
        e.target.value = Math.abs(e.target.value % 30);
        setFinishRow(Number(e.target.value))
    }
    function handleFinishColChange(e){
        e.target.value = Math.abs(e.target.value % 30);
        setFinishCol(Number(e.target.value))
    }
    function handleEpochChange(e,value){
        setEpochs(1000 * Number(value))
    }
    function handleLRChange(e,value){
        setLearningRate(Number(value))
    }
    function handleCuriosityChange(e,value){
        setAgentCuriosity(Number(value))
    }
    function applySettings(){
        props.configureSettings(epochs,startRow,startCol,finishRow,finishCol,learningRate,agentCuriosity);
    }
    function pressTrainingButton(){
        props.configureSettings(epochs,startRow,startCol,finishRow,finishCol,learningRate,agentCuriosity);
        props.startTraining()
    }
    function pressPolicyButton(){
        props.configureSettings(epochs,startRow,startCol,finishRow,finishCol,learningRate,agentCuriosity);
        props.visualizePolicy();
    }
    return (
        <div className = "settings_container">
            <h1 id = "settings_title">Visualizer Settings</h1>
            <div id="divider"></div>
            <table>
                <tbody>
                    <tr>
                        <td>Training Epochs:(Thousands) </td>
                        <td>
                        <div className={classes.slider}>
                            <ThemeProvider theme={muiTheme}>
                                <Slider
                                        defaultValue={500}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="on"
                                        step={50}
                                        marks
                                        min={0}
                                        max={500}
                                        onChangeCommitted={(e,value) => handleEpochChange(e, value)}
                                    />
                            </ThemeProvider>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Start Position: </td>
                        <td>
                            <div className={classes.startRow}>
                            <ThemeProvider theme={textBoxTheme}>
                                <TextField
                                    className={classes.margin}
                                    id="mui-theme-provider-outlined-input"
                                    label="Row"
                                    variant="outlined"
                                    type = "number"
                                    onChange={e => handleStartRowChange(e)}
                                    />
                            </ThemeProvider>
                            </div>
                        </td>
                        <td>
                            <div className={classes.startCol}>
                            <ThemeProvider theme={textBoxTheme}>
                                <TextField
                                    className={classes.margin}
                                    id="mui-theme-provider-outlined-input"
                                    label="Col"
                                    variant="outlined"
                                    type = "number"
                                    onChange={e => handleStartColChange(e)}
                                />
                            </ThemeProvider>
                            </div>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>Target Position: </td>
                        <td>
                            <div className={classes.finishRow}>
                            <ThemeProvider theme={textBoxTheme}>
                                <TextField
                                    className={classes.margin}
                                    id="mui-theme-provider-outlined-input"
                                    label="Row"
                                    variant="outlined"
                                    type = "number"
                                    onChange={e => handleFinishRowChange(e)}

                                />
                            </ThemeProvider>
                            </div>
                        </td>
                        <td>
                            <div className={classes.finishCol} >
                            <ThemeProvider theme={textBoxTheme}>
                                <TextField
                                    className={classes.margin}
                                    id="mui-theme-provider-outlined-input"
                                    label="Col"
                                    variant="outlined"
                                    type = "number"
                                    onChange={e => handleFinishColChange(e)}

                                />
                            </ThemeProvider>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Learning Rate: </td>
                        <td>
                            <div className={classes.slider}>
                                <ThemeProvider theme={muiTheme}>
                                    <Slider
                                        defaultValue={0.4}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="on"
                                        step={0.05}
                                        marks
                                        min={0}
                                        max={1}
                                        onChangeCommitted={(e,value) => handleLRChange(e, value)}
                                    /> 
                                </ThemeProvider> 
                            </div>      
                        </td>
                    </tr>
                    <tr>
                        <td>Agent Curiosity: </td>
                        <td>
                            <div className={classes.slider}>
                                <ThemeProvider theme={muiTheme}>
                                    <Slider
                                        defaultValue={0.7}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="on"
                                        step={0.1}
                                        marks
                                        min={0.1}
                                        max={1}
                                        onChangeCommitted={(e,value) => handleCuriosityChange(e, value)}
                                    />
                                </ThemeProvider>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <div className = "settings-button" id = "settings_button">
                                <AwesomeButtonProgress 
                                    type = "secondary"
                                    size = "medium"
                                    disabled = {false}
                                    loadingLabel = "Training agent"
                                    resultLabel = "Done :-)"
                                    ripple = {true}
                                    action={(element, next) => {
                                        setTimeout(() => {
                                            next(true, '');
                                            pressTrainingButton();
                                        }, 150);
                                    }}
                                >
                                    Apply &amp; Train
                                </AwesomeButtonProgress>
                            </div>
                        </td>
                        <td>
                            <div className = "settings-button" id = "settings_button">
                                <AwesomeButtonProgress 
                                    type = "secondary"
                                    size = "medium"
                                    disabled = {false}
                                    loadingLabel = "Training agent"
                                    resultLabel = "Done :-)"
                                    ripple = {true}
                                    action={(element, next) => {
                                        setTimeout(() => {
                                            next(true, '');
                                            pressPolicyButton();
                                        }, 150);
                                    }}
                                >
                                    Visualize Optimal Policy
                                </AwesomeButtonProgress>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <SettingsLogo id = "settings_icon"/>  
                        </td>
                    </tr>
                </tbody>
        </table>
        </div>
    )
}

export default Settings
