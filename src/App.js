import { useState } from 'react';
import axios from 'axios';
import Spreadsheet from 'react-spreadsheet';
import './App.css';

function App() {
  const [data, setData] = useState([]);
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

    setData(sheetData);
  };
  return (
    <div className="App">
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        {data.length > 0 && (
          <Spreadsheet data={data} />
        )}
      </div>
    </div>
  );
}

export default App;
