
const express = require('express');

const app = express();

app.use(express.static('./dist/preinscriptions-control'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/preinscriptions-control/'}),
);

app.listen(process.env.PORT || 8080);
