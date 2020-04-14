//Require module
const express = require('express');
// Express Initialize
const app = express();
const port = 8000;

const MongoClient = require('mongodb').MongoClient;
const uri="mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority";
class AI{
    _constructor(room_id){

        this.categorie=new Object();
        this.categorie["artists"]=0;
        this.categorie["singers"]=0;
        //TODO: de initializat toate categoriile

        this.room_id=room_id;
    }
    async getAiAnswer(black_card, white_cards) {
        /* var a=black_card; var b=white_cards;
        black_card=parseInt(a);
        white_cards=b.map(Number); */
        var client;
        try {
            client = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
            // console.log("black_card", black_card);
            // console.log("white_cards",white_cards);
            var white_ids=Array();
            white_cards.forEach(i=>white_ids.push(i._id));
            // console.log("white_ids", white_ids);
            // console.log("black_card", black_card._id)
            var a=parseInt(black_card._id);
            var b=white_ids.map(Number);
            // console.log("a ", a, " b ", b);
            var relations = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId:a, whiteCardId : { $in : b } }).toArray();
            
            // console.log(relations);

            var fitness = Array();

            fitness = this.calculateFitness(relations);

            var result = this.selectBest(fitness);
            // console.log(result, "result");
            return white_cards[result];

        }
        catch (e) {
            console.error(e);
            return white_cards[0]
        }
        finally {
            await client.close();
        }
    }
    selectBest(fitness) {

        var wheel = Array();
        wheel.push(fitness[0]);
      
        for(let i=1 ; i<fitness.length ; i++){
          wheel.push(wheel[i-1]+fitness[i]);
        }
      
        return this.select(wheel);
      }
    select(wheel){
        var pos = Math.floor(Math.random()*(wheel[wheel.length-1]));
        for(let i =0 ; i<wheel.length ; i++){
          if(pos<wheel[i])
            return i;
        }
        return wheel.length-1;
    }
    calculateFitness(relations){
        var poz = 0;
        var tmp = Array();
        relations.forEach(i => {
            tmp.push(i.value);
        });
        return tmp;
    }
    async trainAi(white_card,black_card) {
        console.log("da");
        var client;
        try {
            client = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
            var rel1= await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId:black_card, whiteCardId :white_card}).toArray();
            console.log(rel1);
            var myquery = { "blackCardId":black_card,"whiteCardId":white_card };
            var newvalues = { $set: {"value":rel1[0].value+1 } };
            await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").updateOne(myquery,newvalues);
            var rel2= await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId:black_card, whiteCardId :white_card}).toArray();
            console.log(rel2); 
            return "Success";
        }
        catch (e) {
                return "Error";
                console.error(e);
        }
        finally {
            await client.close();
        }
    
    }
}

app.listen(port,()=> {
console.log('listen port 8000');
})
//create api
app.get('/ai', (req,res)=>{
var r;
console.log(req.query.room_id);
console.log(req.query.request);
console.log(req.query.param);
var x=JSON.parse(req.query.param);
// console.log("white_cards.text", x.white_cards[0].text);
// console.log(x);
var aiAnswer=new AI(req.query.room_id);
if (req.query.request==="getAiAnswer"){
    (async ()=> {
        r=await aiAnswer.getAiAnswer(x.black_card, x.white_cards);
        // console.log(r);
        return r;
        
    })().then(result=>{
        var answer=new Object();
        answer["answer"]="Success";
        answer["result"]=result;

        res.send(JSON.stringify(answer));
    });
} else if (req.query.request==="trainAi"){
    (async ()=> {
        r=await aiAnswer.trainAi(parseInt(x.black_card._id), parseInt(x.white_card._id));
        return r;
        
    })().then(result=>{
        var answer=new Object();
        answer["answer"]=result;
        res.send(JSON.stringify(answer));
    });
} else {
    res.send(JSON.stringify("Nu e trainAi sau getAiAnswer"));
}

//res.send('da');
})

