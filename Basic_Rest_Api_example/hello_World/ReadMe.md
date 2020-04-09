refference:https://medium.com/@dharababariya/build-a-hello-world-api-with-node-js-and-express-js-postman-b2e202ebbd44


Acest link arata cum sa faci un API simplu care afiseaza hello world si prezinta in format json informatii

-rulam npm init si spamam enter

-rulam npm install express --save

-luam codul atasat in app.js care face urmatoarele:

     -se conecteaza prin express la portul 8000
     
     -prin app.get('/hello_world', (req,res)=>{ ne spune ca accesam api-ul hello_world
     
     -res.send('Hello World'); afiseaza 'Hello World'
     
     -ne putem conecta acu prin postman la uri-ul http://localhost:8000/hello_world
