const MongoClient = require('mongodb').MongoClient; //necesar pentru a accepta node un client Mongo

async function main(){
	const url = "mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority"; //endpoint-ul de la Mongo; e necesar pentru conectare
	const client = await MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

	var dbo = client.db("HumansAgainstCards"); //dbo va pointa aici specific la baza de date din ""; in Mongo mai sunt si admin si inca una si este necesar sa selectam fix baza asta
 	
	whiteCards = await dbo.collection("white_cards").find({}).toArray();
    blackCards = await dbo.collection("black_cards").find({}).toArray();
	
	
	//pentru resetarea tabelului
/*
	dbo.collection("blackcard_whitecard_relation").drop(function(err, delOK) {
    	if (err) throw err;
    	if (delOK) console.log("Collection deleted");
	});
	dbo.createCollection("blackcard_whitecard_relation", function(err, res) {
		if (err) throw err;
		console.log("Collection created!");
	  });
*/
	var k=0;
	for(var i = 0; i < blackCards.length; i++){
        for (var j = 0; j < whiteCards.length; j++) {
			var myobj = { _id:k++, blackCardId: blackCards[i]._id, whiteCardId: whiteCards[j]._id, value: Random(), category:""};
			await dbo.collection("blackcard_whitecard_relation").insertOne(myobj, function(err, res) {
                if (err) throw err;
        });
	}
}

	await console.log(k);
/*
	dbo.collection("blackcard_whitecard_relation").find({}).toArray(function(err,collections){ 
		if (err) throw err; 
		console.log(collections);
		});
*/
client.close();
	}
function Random(){
	return Math.floor(Math.random()*10+10);
}
main().catch(console.error);
