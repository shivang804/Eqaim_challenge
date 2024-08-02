const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs');
const cors = require('cors');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file.path);
  
  const worksheet = workbook.getWorksheet(1);
  const rows = [];

  worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
    const rowData = [];
    row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
      rowData.push(cell.value);
    });
    rows.push(rowData);
  });

  res.json(rows);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
