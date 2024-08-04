import { useState } from 'react';
import axios from 'axios';
import Spreadsheet from 'react-spreadsheet';
import './App.css';
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

function App() {
  const [sheetData, setsheetData] = useState([]);
  const [wbData, setwbData] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:5000/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const sheetData = response.data.map(row => row.map(cell => ({ value: cell })));
    const wbData = [];
    response.data.forEach((row, r) => {
      row.forEach((v, c) => wbData.push({
        r:r ,
        c:c ,
        v:{
          bg : "rgb(30, 144, 255)", bl : 0, it : 0, ff : 0, fs : 11, fc : "rgb(51, 51, 51)", ht : 1, vt : 1, v: v, 
          ct : {
            fa : "General",
            t : "n"
          }
        }
      }))
    });
    setwbData(wbData);
    setsheetData(sheetData);
    console.log(wbData,sheetData);
  };
  return (
    <div className="App">
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        {sheetData.length > 0 && (
          <Spreadsheet data={sheetData} />
        )}
        {wbData.length > 0 && (

          <Workbook data={[
            { 
              name: "Sheet_1",
              id: "0",
              color: "rgb(30, 144, 255)",
              status: 1.3,
              order: "0",
              row: 20, 
              // column: 8,
              zoomRatio: 1,
              showGridLines: 1,
              defaultRowHeight: 20,
              defaultColWidth: 40,
              celldata:wbData,
              ch_width: 800,
              rh_height: 800,
              config:{
                merge:{}
              }
            }]}/>
        )}
      </div>
    </div>
  );
}

export default App;
