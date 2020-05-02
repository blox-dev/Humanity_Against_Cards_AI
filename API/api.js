//Require module
const express = require('express');
// Express Initialize
const app = express();
const port = 8000;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority";
class AI {
    _constructor(room_id) {

        this.categorie = new Object();
        this.categorie={science: 0, clothes: 0,
            animals: 0, actors: 0, terrorism: 0, nations: 0,
            music_and_singers: 0, superheroes: 0, family: 0,
            food: 0, money: 0, human_body_parts: 0,
            alcohol_and_drugs: 0, games_and_activities: 0, memes: 0,
            racism: 0, sexual: 0, politics: 0, religion: 0, diseases: 0,
            state_of_mind: 0, disgusting: 0};
        //console.log(categorie.science);

        this.room_id = room_id;
    }

    async getAiAnswer(black_card, white_cards, ai_type) {
        var pick = black_card.pick;
        // console.log("pick", pick);
        var client;
        var flag = true;
        try {

            client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            var white_ids = Array();
            if (white_cards[0].length == 1) {
                flag = false;
            }
            console.log(white_cards);
            console.log(white_cards[0]);
            console.log(white_cards[0].length);
            white_cards.forEach(i => i.forEach(j => white_ids.push(j._id)));
            /* white_cards.forEach(i => i.forEach(j => console.log("i ", i, "j ", j))); */
            var a = parseInt(black_card._id);
            var b = white_ids.map(Number);
            // console.log("b", b);
            var relations = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId: a, whiteCardId: { $in: b } }).toArray();
            var fitness_aux = Array();
            var fitness = Array();
            // console.log("relations", relations);
            fitness_aux = this.calculateFitness(relations);
            if (flag)
                for (let i = 0; i < white_cards.length; i++) {
                    fitness.push(fitness_aux[i * pick]);
                    for (let j = 1; j < pick; j++) {
                        console.log(fitness_aux[i * pick + j], i * pick + j);
                        fitness[i] += fitness_aux[i * pick + j];
                    }
                }
            else fitness = fitness_aux;
            console.log("fitness", fitness);
            var ret = Array();
            var result;
            while (ret.length < pick) {
                result = this.selectBest(fitness,ai_type,ret.length+1); //ret.length adaugat pentru cazul best din switch... 
                if (flag) {
                    return white_cards[result];
                }
                if (!ret.includes(white_cards[result][0])){
                    ret.push(white_cards[result][0]);
                }
            }
            return ret;
        }
        catch (e) {
            console.error(e);
            return Array(white_cards[0]);
        }
        finally {
            await client.close();
        }
    }

    selectBest(fitness,ai_type,n) {
        switch(ai_type)
        {
            case "wheel":
            var wheel = Array();
            wheel.push(fitness[0]);
            for (let i = 1; i < fitness.length; i++)
                wheel.push(wheel[i - 1] + fitness[i]);
            return this.select(wheel);

            case "random":
                return (int)(Math.random()*fitness.length);
            
            case "best":
                return this.ordered(fitness,n);
        }
    }

    select(wheel) {
        var pos = Math.floor(Math.random() * (wheel[wheel.length - 1]));
        for (let i = 0; i < wheel.length; i++) {
            if (pos < wheel[i])
                return i;
        }
        return wheel.length - 1;
    }

    ordered(fitness,n){
        // aici vreau sa selectez cartea care are al n-lea fitness, dupa ce am ordonat descrescator. Nu stiu cum as putea face incat sa memorez indecsii care erau inainte de sortare
        // pentru ca din cate cred aceia este valoarea pe care o vrem la return, nu fitness-ul sau indexul cartii in sine
    }
    calculateFitness(relations) {
        var poz = 0;
        var tmp = Array();
        relations.forEach(i => {
            tmp.push(i.value);
        });
        return tmp;
    }
    /*
    calculateFitness(relations,session) {
        var poz = 0;
        var tmp = Array();
        session.picks.forEach(i => categorie.nume) // aici vreau sa folosesc vectorii din constructor ca vectori de frecventa; sa vad in sesiunea curenta cate carti din fiecare categorie au fost alese

        relations.forEach(i => {
            tmp.push((i.value*(8+categorie.(i.categorie)))/8); // cu cat va fi mai des akes un raspuns, cu atat vom avea bonus mai mare. Aici, daca e aleasa o categorie de 8 ori, atunci fitness-ul se dubleaza
        });
        return tmp;
    }
    */
    async trainAi(black_card, white_card) {
        console.log("da");
        var client;
        try {
            client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            var rel1 = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId: black_card, whiteCardId: white_card }).toArray();
            console.log(rel1);
            var myquery = { "blackCardId": black_card, "whiteCardId": white_card };
            var newvalues = { $set: { "value": rel1[0].value + 1 } };
            await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").updateOne(myquery, newvalues);
            var rel2 = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId: black_card, whiteCardId: white_card }).toArray();
            console.log(rel2);
            return "Success";
        }
        catch (e) {
            console.error(e);
            return "Error";

        }
        finally {
            await client.close();
        }
    }
}

app.listen(port, () => {
    console.log('listen port 8000');
})
//create api
app.get('/ai', (req, res) => {
    var r;
    console.log(req.query.room_id);
    console.log(req.query.request);
    console.log(req.query.param);
    var x = JSON.parse(req.query.param);
    // console.log("white_cards.text", x.white_cards[0].text);
    // console.log(x);
    var aiAnswer = new AI(req.query.room_id);
    if (req.query.request === "getAiAnswer") {
        (async () => {
            r = await aiAnswer.getAiAnswer(x.black_card[0], x.white_cards, x.ai_type || "wheel");
            // console.log(r);
            return r;

        })().then(result => {
            var answer = new Object();
            answer["answer"] = "Success";
            answer["result"] = result;

            res.send(JSON.stringify(answer));
        });
    } else if (req.query.request === "trainAi") {
        (async () => {
            //            white_cards.forEach(i => i.forEach(j => white_ids.push(j._id)));
            var r = "Success"
            x.white_cards.forEach(i => {
                (async () => {
                    r1 = await aiAnswer.trainAi(parseInt(x.black_card[0]._id), parseInt(i._id));
                    if (r1 == "Error")
                        r = r1;
                })();

            });
            return r;

        })().then(result => {
            var answer = new Object();
            answer["answer"] = result;
            res.send(JSON.stringify(answer));
        });
    } else {
        res.send(JSON.stringify("Nu e trainAi sau getAiAnswer"));
    }

    //res.send('da');
})