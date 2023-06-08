const express = require('express');
const app = express();

app.get('/date', (req, res) => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // Add 1 to get the month as 1-based index
    res.json({ month });
});


app.listen(3000, () => {
    console.log('API server is running on port 3000');
});
