const express = require('express');
const app = express();

app.get('/date', (req, res) => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString('en-US', { month: 'long' });
    const year = currentDate.getFullYear();
    const date = `${month} ${year}`
    // console.log(`Month: ${month}, Year: ${year}`);
    res.json({ date });
});

app.listen(3000, () => {
    console.log('API server is running on port 3000');
});
