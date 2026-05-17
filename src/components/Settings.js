import React, { useState } from 'react';
import { AwesomeButtonProgress } from 'react-awesome-button';
import "react-awesome-button/dist/styles.css";
import { Slider, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { ReactComponent as SettingsLogo } from '../assets/settings.svg';

const sliderBoxSx = {
   marginTop: '15px',
   marginBottom: '10px',
   width: '150px',
};

const startRowSx = { width: '75px', marginTop: '-15px', marginLeft: '-5px', marginBottom: '5px' };
const startColSx = { width: '75px', marginTop: '-15px', marginLeft: '-75px', marginBottom: '5px' };
const finishRowSx = { width: '75px', marginBottom: '25px', marginLeft: '-5px' };
const finishColSx = { width: '75px', marginBottom: '25px', marginLeft: '-75px' };

const muiTheme = createTheme({
   components: {
      MuiSlider: {
         styleOverrides: {
            thumb: { color: 'black' },
            track: { color: 'green' },
            rail: { color: 'black' },
         },
      },
   },
});

const textBoxTheme = createTheme({
   palette: { primary: green },
});

function Settings(props) {
   const [epochs, setEpochs] = useState(1000);
   const [startRow, setStartRow] = useState(5);
   const [startCol, setStartCol] = useState(5);
   const [finishRow, setFinishRow] = useState(25);
   const [finishCol, setFinishCol] = useState(25);
   const [learningRate, setLearningRate] = useState(0.2);
   const [agentCuriosity, setAgentCuriosity] = useState(0.8);

   function clamp(value) {
      return Math.abs(Number(value) % 30);
   }

   function pressTrainingButton() {
      props.configureSettings(epochs, startRow, startCol, finishRow, finishCol, learningRate, agentCuriosity);
      props.startTraining();
   }

   function pressPolicyButton() {
      props.updateAgentCuriosity(agentCuriosity);
      props.visualizePolicy();
   }

   return (
      <div className="settings_container">
         <h1 id="settings_title">Visualizer ML Settings</h1>
         <div id="divider"></div>
         <table>
            <tbody>
               <tr>
                  <td>Training Epochs: </td>
                  <td>
                     <div style={sliderBoxSx}>
                        <ThemeProvider theme={muiTheme}>
                           <Slider
                              defaultValue={1000}
                              valueLabelDisplay="on"
                              step={100}
                              marks
                              min={100}
                              max={1500}
                              onChangeCommitted={(_, value) => setEpochs(Number(value))}
                           />
                        </ThemeProvider>
                     </div>
                  </td>
               </tr>
               <tr>
                  <td>Start Position: </td>
                  <td>
                     <div style={startRowSx}>
                        <ThemeProvider theme={textBoxTheme}>
                           <TextField
                              label="Row"
                              variant="outlined"
                              type="number"
                              onChange={e => setStartRow(clamp(e.target.value))}
                           />
                        </ThemeProvider>
                     </div>
                  </td>
                  <td>
                     <div style={startColSx}>
                        <ThemeProvider theme={textBoxTheme}>
                           <TextField
                              label="Col"
                              variant="outlined"
                              type="number"
                              onChange={e => setStartCol(clamp(e.target.value))}
                           />
                        </ThemeProvider>
                     </div>
                  </td>
               </tr>
               <tr>
                  <td>Target Position: </td>
                  <td>
                     <div style={finishRowSx}>
                        <ThemeProvider theme={textBoxTheme}>
                           <TextField
                              label="Row"
                              variant="outlined"
                              type="number"
                              onChange={e => setFinishRow(clamp(e.target.value))}
                           />
                        </ThemeProvider>
                     </div>
                  </td>
                  <td>
                     <div style={finishColSx}>
                        <ThemeProvider theme={textBoxTheme}>
                           <TextField
                              label="Col"
                              variant="outlined"
                              type="number"
                              onChange={e => setFinishCol(clamp(e.target.value))}
                           />
                        </ThemeProvider>
                     </div>
                  </td>
               </tr>
               <tr>
                  <td>Learning Rate: </td>
                  <td>
                     <div style={sliderBoxSx}>
                        <ThemeProvider theme={muiTheme}>
                           <Slider
                              defaultValue={0.2}
                              valueLabelDisplay="on"
                              step={0.05}
                              marks
                              min={0}
                              max={1}
                              onChangeCommitted={(_, value) => setLearningRate(Number(value))}
                           />
                        </ThemeProvider>
                     </div>
                  </td>
               </tr>
               <tr>
                  <td>Agent Curiosity: </td>
                  <td>
                     <div style={sliderBoxSx}>
                        <ThemeProvider theme={muiTheme}>
                           <Slider
                              defaultValue={0.8}
                              valueLabelDisplay="on"
                              step={0.1}
                              marks
                              min={0.1}
                              max={1}
                              onChangeCommitted={(_, value) => setAgentCuriosity(Number(value))}
                           />
                        </ThemeProvider>
                     </div>
                  </td>
               </tr>
               <tr>
                  <td>
                     <div className="settings-button" id="settings_button">
                        <AwesomeButtonProgress
                           type="secondary"
                           size="medium"
                           loadingLabel="Training agent"
                           resultLabel="Done :-)"
                           ripple
                           onPress={(event, release) => {
                              setTimeout(() => {
                                 release(true, '');
                                 pressTrainingButton();
                              }, 150);
                           }}
                        >
                           Apply &amp; Train
                        </AwesomeButtonProgress>
                     </div>
                  </td>
                  <td>
                     <div className="settings-button" id="settings_button">
                        <AwesomeButtonProgress
                           type="secondary"
                           size="medium"
                           loadingLabel="Calculating Optimal Policy"
                           resultLabel="Done :-)"
                           ripple
                           onPress={(event, release) => {
                              setTimeout(() => {
                                 release(true, '');
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
                     <SettingsLogo id="settings_icon" />
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
   );
}

export default Settings;
