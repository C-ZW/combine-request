# Combin Request

combine request tool can be used to server side adn client side

base on [request-promise](https://github.com/request/request-promise)

---

## Example:

### server

```ts
import { CombineRequest, combineRoute } from 'combine-request';

...
...
...

app.get('/a', (req, res) => res.send('a'));
app.get('/b', (req, res) => res.send('b'));
app.post('/c', (req, res) => res.send('c'));
```

### In client side you can use

```ts
let cbr = new CombineRequest('http://localhost:9999');

cbr.get('/a')
    .get('/b')
    .post('/c')

console.log(await cbr.exec()) 
// ['a', 'b', 'c']
```

---


### Or add in server route

```ts
app.get('/combin', conbineRoute)
```

### client side

```ts

let result = await rp.post('http://localhost:9999/combine', {
        json: true,
        body: {
            domain: 'http://localhost:9999',
            get: [{ path: '/a' }, { path: '/b' }],
            post: [{ path: '/c' }]
            // {path, options}
            // options is request options
        }
    });
console.log(result)
// ['a', 'b', 'c']

```



these example in /test/index.test.ts


---

or custom route

```ts
app.get('/many', (req, res) => {
    let cbr = new CombineRequest('http://localhost:9999');

    cbr.get('/a')
        .get('/b')
    
    res.send(await cbr.exec());
})
```

---