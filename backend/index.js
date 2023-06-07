const express = require('express');
const app = express();

app.get('/date', (req, res) => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString('en-US', { month: 'long' });
    const year = currentDate.getFullYear();

    res.json({ month, year });
});

app.listen(3000, () => {
    console.log('API server is running on port 3000');
});
