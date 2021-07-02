import React from 'react'
import {  AwesomeButton, AwesomeButtonSocial } from 'react-awesome-button';
import "react-awesome-button/dist/styles.css";
import { Button, Select, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as InfoLogo } from '../assets/info.svg';

function Settings(props) {
    //function color_to_RGB_string(color){
	//	return `rgb(${color.r*255}, ${color.g*255}, ${color.b*255})`;
    //}
    const useStyles = makeStyles((theme) => ({
        root: {
          '& > *': {
            //margin: theme.spacing(1),
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
      }));
    const classes = useStyles();

    return (
        <div className = "settings_container">
            <h1 id = "info_title">Visualizer Settings</h1>
            <p1>Select a Machine Learning Algorithm To Train Your Agent</p1>
            <table>
                <tbody>
                    <tr>
                        <td>ML Algorithm: </td>
                        <td>
                            <div className={classes.root}>
                                <Select name = "algorithmSpeed" id = "algorithmSpeed" displayEmpty >
                                    <MenuItem ></MenuItem>
                                    <MenuItem value = "qLearning">Q-Learning</MenuItem>
                                    <MenuItem value = "valueIteration">Value Iteration</MenuItem>
                                    <MenuItem value = "DRL">Deep Reinforcement Learning</MenuItem>
                                </Select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Training Epochs: </td>
                        <td>
                            <div className={classes.root}>
                                <Select name = "algorithmSpeed" id = "algorithmSpeed" displayEmpty >
                                    <MenuItem ></MenuItem>
                                </Select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Start Position: </td>
                        <td>
                            <div className={classes.root}>
                                <Select name = "algorithmSpeed" id = "algorithmSpeed" displayEmpty >
                                    <MenuItem ></MenuItem>
                                </Select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Target Position: </td>
                        <td>
                            <div className={classes.root}>
                                <Select name = "algorithmSpeed" id = "algorithmSpeed" displayEmpty >
                                    <MenuItem ></MenuItem>
                                </Select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Learning Rate: </td>
                        <td>
                            <div className={classes.root}>
                                <Select name = "algorithmSpeed" id = "algorithmSpeed" displayEmpty >
                                    <MenuItem ></MenuItem>
                                </Select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Agent Curiosity: </td>
                        <td>
                            <div className={classes.root}>
                                <Select name = "algorithmSpeed" id = "algorithmSpeed" displayEmpty >
                                    <MenuItem ></MenuItem>
                                </Select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Apply settings</td>
                        <td>
                            <div className = "settings-button" id = "settings_button">
                                <AwesomeButton
                                    type="secondary"
                                    size = "big"
                                >
                                    Apply Settings
                                </AwesomeButton>
                            </div>
                        </td>
                    </tr>
                </tbody>
        </table>
        </div>
    )
}

export default Settings
