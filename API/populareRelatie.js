
var MongoClient = require('mongodb').MongoClient; //necesar pentru a accepta node un client Mongo
const url = "mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority"; //endpoint-ul de la Mongo; e necesar pentru conectare
var whiteCards;
var blackCards;

    MongoClient.connect(url,async function(err, db) { 
    if (err) throw err;
    var dbo = db.db("HumansAgainstCards"); 
    
    whiteCards = await dbo.collection("white_cards").find({}).toArray();
    blackCards = await dbo.collection("black_cards").find({}).toArray();

    //inserarea campurilor blackCardId si whiteCardId in colectia blackcard_whitecard_relation
    for(var i = 0; i < blackCards.length; i++){
        for (var j = 0; j < whiteCards.length; j++) {
            var myobj = { blackCardId: blackCards[i]._id, whiteCardId: whiteCards[j]._id };
            dbo.collection("blackcard_whitecard_relation").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            });
        }
    }

    //echivalent cu select * from blackcard_whitecard_relation
    await dbo.collection("blackcard_whitecard_relation").find({}).toArray(function(err,collections){ 
    if (err) throw err; 
    console.log(collections);
    });

 db.close();

});
