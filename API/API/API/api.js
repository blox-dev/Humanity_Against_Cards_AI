//Require module
const express = require('express');
// Express Initialize
const app = express();
const port = 8000;
app.listen(port,()=> {
console.log('listen port 8000');
})
//create api
app.get('/ai', (req,res)=>{
console.log(req.query.room_id);
console.log(req.query.request);
console.log(req.query.param);
var x=JSON.parse(req.query.param);
console.log(x.black_card);
console.log(x.p);
res.send('Hello World');
})