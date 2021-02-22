import React from 'react'

function Tutorial(props) {
    //function color_to_RGB_string(color){
	//	return `rgb(${color.r*255}, ${color.g*255}, ${color.b*255})`;
    //}

    return (
        <div className = "info_container">
            <h1>This is the information container</h1>
            <table>
                <tr>
                    <td>
                    <div className="start_square" ></div>
                    </td>
                    <td>Start Node</td>
                </tr>
                <tr>
                    <td>
                    <div className="finish_square" ></div>
                    </td>
                    <td>Finish Node</td>
                </tr>
                <tr>
                    <td>
                    <div className="visited_square" ></div>
                    </td>
                    <td>Visited Node</td>
                </tr>
                <tr>
                    <td>
                    <div className="path_square" ></div>
                    </td>
                    <td>Path Node</td>
                </tr>
            </table>
        </div>
    )
}

export default Tutorial
