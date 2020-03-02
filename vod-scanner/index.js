const express = require('express');
const modules = require('./modules');
const app = express();
const port = 3010;

app.get('/', (req, res) => res.status(404).send("Error 404: Not Found"));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
    modules.scanVODs();
});