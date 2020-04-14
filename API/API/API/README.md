# instantiere:
  - trebuie descarcat fisierul api.js intr-un folder separat
  - in acest folder se deschide ruleaza comenzile npm init (se apasa apoi enter pana se termina)
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
    - pentru *getAiAnswer*: {*"black_card"*: "id_carte_neagra", *"white_cards"*: [lista_cu_id_carti_albe] }
      - intoarce un mesaj de succes si doar unul dintre lista_cu_id_carti_albe primite prin parametrii
    - pentru *trainAi*: {*"black_card"*: "id_carte_neagra", *"white_card"*: "id_carte_alba" }
      - intoarce doar un mesaj de succes
    - pentru *getProbability*: {}
      - intoarce un mesaj de succes precum si o valoare intre 0 si 100
    - pentru *setProbability*: {*"p"*: "probability"}, unde 0<=probability<=100
      -intoarce doar un mesaj de succes
    - exemple de utilizare: 

  ```javascript
  http://localhost:8000/ai?room_id=1&request=getAiAnswer&param={"black_card": "1",  "white_cards": ["1", "2", "3", "4"]}
  ```

  ```javascript
  http://localhost:8000/ai?room_id=1&request=trainAi&param={"black_card": "1", "white_card": "2"}
  ```

  ```javascript
  http://localhost:8000/ai?room_id=1&request=getProbability&param={}
  ```

  ```javascript
  http://localhost:8000/ai?room_id=1&request=setProbability&param={"p": "30"}
  ```
    
  
