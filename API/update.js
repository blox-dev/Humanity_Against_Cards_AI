var MongoClient = require('mongodb').MongoClient; //necesar pentru a accepta node un client Mongo
const url = "mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority"; //endpoint-ul de la Mongo; e necesar pentru conectare

    MongoClient.connect(url, function(err, db) { 
  	if (err) throw err;
  	var dbo = db.db("HumansAgainstCards"); //dbo va pointa aici specific la baza de date din ""; in Mongo mai sunt si admin si inca una si este necesar sa selectam fix baza asta
 	
	dbo.listCollections().toArray(function(err, items) { //aici afisam ce colectii/tabele exista in baza de date
	console.log(items);
  	});

	dbo.collection("white_cards").find({}).toArray(function(err,collections){ //echivalent cu select * din tabela white_cards
	if (err) throw err;	
	console.log(collections);
	});

	dbo.collection("black_cards").find({}).toArray(function(err,collections){ //idem
	if (err) throw err;	
	console.log(collections);
	db.close();
	});
});


