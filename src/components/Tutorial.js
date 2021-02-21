import React from 'react'

function Tutorial(props) {
    function color_to_RGB_string(color){
		return `rgb(${color.r*255}, ${color.g*255}, ${color.b*255})`;
    }

    return (
        <div class = "info_container">
            <h1>This is the information container</h1>
            <table>
                <tr>
                    <td>
                    {/*<div class="square" style="background-color: ${color_to_RGB_string(props.color.start)}" ></div>*/}
                    </td>
                    <td>Start Node</td>
                </tr>
            </table>
        </div>
    )
}

export default Tutorial
