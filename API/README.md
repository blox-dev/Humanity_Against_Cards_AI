# instantiere:
  - trebuie descarcat fisierul api.js intr-un folder separat
  - in acest folder se deschide si ruleaza comenzile npm init (se apasa apoi enter pana se termina)
  - se ruleaza npm install express --save
  - se ruleaza npm install mongodb
  - se deschide serverul prin node api.js
# mod de folosire
  - AI-ul poate fi accesat ca API dupa modelul urmator: 
  - localhost:8000/ai
  - parametru 1: obligatoriu : (**room_id**), id-ul camerei de joc care face requestul pentru raspunsul AI-ului
  - parametrul 2: requestul propriu-zis: (**request**) poate fi doar:
    - getAiAnswer
    - trainAi
    - getProbability
    - setProbability
  - parametrul 3: (**param**), contine parametrii fiecarui tip de request.
    - pentru *getAiAnswer*: {*"black_card"*: "JSON.stringify(blackCard)", *"white_cards"*: JSON.stringify(whiteCardsList) }
      - intoarce un mesaj de succes si doar unul dintre whiteCardsList in format JSON
    - pentru *trainAi*: {*"black_card"*: "JSON.stringify(blackCard)a", *"white_card"*: "JSON.stringify(whiteCard)" }
      - intoarce doar un mesaj de succes
    - pentru *getProbability*: {}
      - intoarce un mesaj de succes precum si o valoare intre 0 si 100
    - pentru *setProbability*: {*"p"*: "probability"}, unde 0<=probability<=100
      -intoarce doar un mesaj de succes
    - exemple de utilizare: 




```javascript
http://localhost:8000/ai?room_id=1&request=getAiAnswer&param={"black_card": { "_id": "1", "text": "I got 99 problems but  ain't one.", "pick": "1" },  "white_cards": [{ "_id": "1", "text":  "Man meat."},  { "_id": "2", "text": "Autocannibalism."}] }
```

```javascript
http://localhost:8000/ai?room_id=1&request=trainAi&param={"black_card": { "_id": "1", "text": "I got 99 problems but  ain't one.", "pick": "1" }, "white_card": { "_id": "1", "text":  "Man meat."}}
```

```javascript
http://localhost:8000/ai?room_id=1&request=getProbability&param={}
```

```javascript
http://localhost:8000/ai?room_id=1&request=setProbability&param={"p": "30"}
```
    
# Posibile erori

  - doar **getAiAnswer** si **trainAi** sunt tratate

  - nu este tratata exceptia pentru momentul in care nu se primeste raspuns, deci in aceste cazuri fie trebuie trimise requesturi noi, fie trebuie restartat serverul

