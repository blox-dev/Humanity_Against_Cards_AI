"use strict"
//Require module
const express = require('express');
// Express Initialize
const app = express();
const port = 8000;

var ai_players = Array();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority";
class AI {
    constructor(room_id) {
        this.probability = 50;
        this.categorie = {};
        this.categorie = {
            science: 0, clothes: 0,
            animals: 0, actors: 0, terrorism: 0, nations: 0,
            music_and_singers: 0, superheroes: 0, family: 0,
            food: 0, money: 0, human_body_parts: 0,
            alcohol_and_drugs: 0, games_and_activities: 0, memes: 0,
            racism: 0, sexual: 0, politics: 0, religion: 0, diseases: 0,
            state_of_mind: 0, disgusting: 0
        };

        this.room_id = room_id;
    }

    setProbability(p) {
        if (0 <= p && p <= 100) {
            this.probability = p;
            return "Success";
        }
        return "Error";
    }

    getProbability() {
        return this.probability;
    }

    async getAiAnswer(black_card, white_cards) {
        var pick = black_card.pick;
        var client;
        var flag = true;

        try {
            client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            var white_ids = Array();
            if (white_cards[0].length === 1) {
                flag = false;
            }
            console.log(white_cards);
            white_cards.forEach(i => i.forEach(j => white_ids.push(j._id)));

            var blackCardId = parseInt(black_card._id);
            var whiteCardIds = white_ids.map(Number);

            var relations = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId: blackCardId, whiteCardId: { $in: whiteCardIds } }).toArray();

            var fitness_aux;
            var fitness = Array();
            fitness_aux = this.calculateFitness(relations);

            if (flag) {
                for (var i = 0; i < white_cards.length; i++) {
                    fitness.push(fitness_aux[i * pick]);
                    for (var j = 1; j < pick; j++) {
                        console.log(fitness_aux[i * pick + j], i * pick + j);
                        fitness[i] += fitness_aux[i * pick + j];
                    }
                }
            }
            else fitness = fitness_aux;
            console.log(fitness);
            var result = Array();
            var pickedWhiteCard;

            while (result.length < pick) {
                pickedWhiteCard = this.selectBest(fitness);
                if (flag) {
                    return white_cards[pickedWhiteCard];
                }
                if (!result.includes(white_cards[pickedWhiteCard][0]))
                    result.push(white_cards[pickedWhiteCard][0]);
            }
            return result;
        }
        catch (e) {
            console.error(e);
            return Array(white_cards[0]);
        }
        finally {
            await client.close();
        }
    }

    selectBest(fitness) {
        switch (this.probability) {
            case 0: //random complet
                return (int)(Math.random() * fitness.length);

            case 100: //roata-norocului
                var wheel = Array();
                wheel.push(fitness[0]);

                for (var i = 1; i < fitness.length; i++) {
                    wheel.push(wheel[i - 1] + fitness[i]);
                }

                return this.select(wheel);

            default: //proportional, cu cat e probability mai mare, cu atat e mai probabil sa fie alese cartile cu fitness mare
                let sum = 0; //suma totala a fitnesilor
                let sume_partiale = [];
                let copieFitness = fitness.slice(); //copie ca sa nu modificam vectorul fitness (si mai apoi sa il comparam cu acesta)
                //aparent in JS daca copiezi vectori prin = e doar referinta si orice operatie asupra "copiei" va avea loc si asupra obiectului din care ai copiat
                copieFitness.sort(function (a, b) { return a - b }); //sortare crescatoare
                for (var i = 0; i < fitness.length; i++) { //toate
                    sum += copieFitness[i]; //suma totala
                    sume_partiale.push(sum); // sume partiale
                }
                let random = Math.random() * sum * (1 + this.probability / 50);//alegem un numar random intre 0 si suma... la p=0. Daca p=100, atunci random va fi de 3 ori mai mare decat de obicei, conducand la alegeri de fitness mai mare 
                /*
                console.log("Vectorul fitnss sortat:" + copieFitness);
                console.log("Sumele partiale:" + sume_partiale);
                console.log("Randomul ales:" + random);
                */
                //vom alege acel cartea cu cel mai mic fitness care este deasupra lui random
                for (var i = 0; i < sume_partiale.length; i++)
                    if (sume_partiale[i] > random) //am gasit indexul in sirul sortat
                    {
                        for (var j = 0; j < fitness.length; j++) // cautam elementul in vectorul initial;
                            if (copieFitness[i] === fitness[j]) // este posibil sa existe duplicate de valori, dar nu conteaza, sunt la fel de bune
                                return j;
                    }
                //daca nu am dat return pana acum, atunci a ramas elementul cu fitness-ul maxim
                for (var j = 0; j < fitness.length; j++) // cautam elementul in vectorul initial;
                    if (copieFitness[fitness.length - 1] === fitness[j]) // este posibil sa existe duplicate de valori, dar nu conteaza, sunt la fel de bune
                        return j;
        }
    }

    select(wheel) {
        var pos = Math.floor(Math.random() * (wheel[wheel.length - 1]));
        for (var i = 0; i < wheel.length; i++) {
            if (pos < wheel[i])
                return i;
        }
        return wheel.length - 1;
    }

    calculateFitness(relations) {
        var tmp = Array();
        relations.forEach(i => {
            var categ = i.category; //categoria cartii careia i se calculeaza fitness-ul acu,
            tmp.push(i.value * this.Fibo(this.categorie.categ));
        });
        return tmp;
    }

    Fibo(n) { //Fibonacci recursiv pornind de la numere usor mai mici; Am ales 1 si 1.5 pentru ca ies niste numere "rotunde" (adica cu parte fractionala = 1/2^n);
        if (n === 0 || typeof n === 'undefined')
            return 1;
        else if (n === 1)
            return 1.5;
        return (this.Fibo(n - 1) + this.Fibo(n - 2)) / (1.5 - this.probability / 100);
    }
    /* Am ales in Fibo sa implementez probabilitatea in felul urmator:
    La p=0, este facut Fibonacci redus(impartindu-se la 1.5, numerele cresc foarte putin la fiecare iteratie)
    La p=50, este Fibonacci normal (valorile * ~1.6 la fiecare alegere in plus)
    La p=100, este Fibonacci accelerat (dublat) (valorile *3.2 la fiecare alegere) 
    Pentru p mare, ar putea eventual exista riscul ca jucatorii sa aleaga intentionat alegeri "proaste" pentru a deruta AI-ul..
     desi e greu de crezut ca ar fi critic pentru ca e important si fitness-ul de baza
    */
    async trainAi(black_card, white_card) {
        var client;
        try {
            client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            var rel1 = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId: black_card, whiteCardId: white_card }).toArray();

            //aici vom incrementa categoria ultimei carti albe jucate:
            this.categorie[rel1[0].category]++;
            console.log(this.categorie);
            console.log(rel1);

            var myQuery = { "blackCardId": black_card, "whiteCardId": white_card };
            var newValues = { $set: { "value": rel1[0].value + 1 } };
            await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").updateOne(myQuery, newValues);
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
});

//create api
app.get('/ai', (req, res) => {
    console.log(req.query.room_id);
    console.log(req.query.request);
    console.log(req.query.param);

    var parsedQuery = JSON.parse(req.query.param);
    var ai;
    let position = search_room(req.query.room_id);
    if (position === -1) {
        ai = new AI(req.query.room_id);
        ai_players.push(ai);
    } else {
        ai = ai_players[position];
    }

    switch (req.query.request) {
        case "getAiAnswer":
            ai.getAiAnswer(parsedQuery.black_card[0], parsedQuery.white_cards)
                .then(result => res.send(JSON.stringify({ answer: "Success", result: result })));
            break;

        case "trainAi":
            (async () => {
                //white_cards.forEach(i => i.forEach(j => white_ids.push(j._id)));
                for (let white_card of parsedQuery.white_cards) {
                    var result = await ai.trainAi(parseInt(parsedQuery.black_card[0]._id), parseInt(white_card[0]._id));
                    if (result === "Error")
                        return [result, "Couldn't update the db."];
                }
                return ["Success", "Updated the db successfully."];
            })().then((result) => {
                res.send(JSON.stringify({ answer: result[0], result: result[1] }));
            });
            break;

        case "setProbability":
            var result = ai.setProbability(parseInt(parsedQuery.p));
            if (result === "Error")
                res.send(JSON.stringify({ answer: "Error", result: "Invalid probability. Set 0-100" }));
            res.send(JSON.stringify({ answer: "Success", result: "Probability set to " + parsedQuery.p }));
            break;

        case "getProbability":
            var probability = ai.getProbability();
            res.send(JSON.stringify({ answer: "Success", result: probability }));
            break;

        default:
            res.send(JSON.stringify({ answer: "Error", result: "Invalid command." }));
    }
}
);
function search_room(room_id) {
    for (let i = 0; i < ai_players.length; i++)
        if (ai_players[i].room_id === room_id)
            return i;
    return -1;
}
