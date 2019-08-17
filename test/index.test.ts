import express from 'express';
import { CombineRequest, combineRoute } from '../index';
import bodyParser from 'body-parser';
import rp from 'request-promise';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post('/combine', combineRoute);

app.delete('/many', async (req, res, next) => {
    let cbr = new CombineRequest('http://localhost:9999');

    cbr.delete('/b')
        .delete('/a');

    return res.json(await cbr.exec());
});

app.get('/a', (req, res) => {
    res.send('a')
});

app.get('/b', (req, res) => {
    res.send('b')
});

app.post('/c', (req, res) => {
    res.send('c')
});

app.delete('/a', (req, res) => {
    res.send('delete a');
});

app.delete('/b', (req, res) => {
    res.send('delete b');
})

app.listen(9999, () => {
    console.log('server start port 9999');

    async function test1() {
        let cbr = new CombineRequest('http://localhost:9999');

        cbr.get('/a')
            .get('/b')
            .post('/c')

        console.log(await cbr.exec())
    }

    async function test2() {
        try {
            let result = await rp.post('http://localhost:9999/combine', {
                json: true,
                body: {
                    domain: 'http://localhost:9999',
                    get: [{ path: '/a' }, { path: '/b' }],
                    post: [{ path: '/c' }]
                }
            });
            console.log(result)
        } catch (err) {
            console.log(err)
        }
    }

    test1();
    test2();
    process.exit();
});


