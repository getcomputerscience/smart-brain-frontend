import React from 'react';
import './FaceDetection.css';

const FaceDetection = ({box, imgURL}) => {
    return (
        <div className="center ma">
            <div className="absolute m2">
                <img id='inputimage' src={imgURL} alt={"Face"} width='500px' height='auto'></img>
                <div className="bounding-box" 
                    style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}} ></div>
            </div>
        </div>
    );
}

export default FaceDetection;