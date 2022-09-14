import express from 'express';
const app = express();
app.get('/', (req, res) => {
    return res.json([
        { id: 1, name: "Anucio 1" },
        { id: 2, name: "Anucio 2" },
        { id: 3, name: "Anucio 3" },
    ]);
});
app.listen(3333);
