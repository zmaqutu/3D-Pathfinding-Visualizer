import React from 'react'
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
            width: '225px',
            
        },
        startRow:{
            width:'75px',
            marginTop:'-15px',
            marginLeft: '85px',
            marginBottom:'5px',



        },
        startCol:{
            width:'75px',
            marginTop:'-15px',
            marginLeft: '-62.5px',
            marginBottom:'5px',
            

        },
        finishRow:{
            width:'75px',
            marginBottom:'20px',
            marginLeft: '85px',


        },
        finishCol:{
            width:'75px',
            marginBottom:'20px',
            marginLeft: '-62.5px',
            
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
      console.log(muiTheme)

      const textBoxTheme = createMuiTheme({
        palette: {
          primary: green,
        },
      });

    return (
        <div className = "settings_container">
            <h1 id = "settings_title">Visualizer Settings</h1>
            <div id="divider"></div>
            <table>
                <tbody>
                    <tr>
                        <td>Training Epochs: </td>
                        <td>
                        <div className={classes.slider}>
                            <ThemeProvider theme={muiTheme}>
                                <Slider
                                        defaultValue={5}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="on"
                                        step={1}
                                        marks
                                        min={1}
                                        max={5}
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
                                        defaultValue={0.4}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="on"
                                        step={0.1}
                                        marks
                                        min={0}
                                        max={1}
                                    />
                                </ThemeProvider>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
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
                                            //setClearPath(true)
                                        }, 150);
                                    }}
                                >
                                    ApplySettings
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
