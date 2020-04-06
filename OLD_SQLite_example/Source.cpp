#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>
#include "sqlite3.h" 
#include <string>

/*  
	Citeste asta dupa ce intalnesti callback mai jos in program:


	functie folosita de sqlite3_exec care este apelata de fiecare data cand se executa o comanda de tip select si 
	se gaseste o inregistrare care corespunde cerintelor. Numarul de parametri si tipul este predefinit, NU poate
	fi modificat. Daca ai nevoie de o functie de callback cu alti parametri, trebuie sa folosesti o alta functie
	din sqlite, pt ca sqlite3_exec este un wrapper (documenteaza-te). 

*/

static int callback(void *data, int argc, char **argv, char **azColName) {
	int i;
	printf("%s: ", (const char*)data);

	for (i = 0; i < argc; i++) {
		printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
	}

	printf("\n");
	return 0;
}

int main(int argc, char* argv[]) {
	sqlite3 *db; //database pointer
	char *zErrMsg = 0; //mesajul de eroare returnat de functii
	int rc; //folosit pentru verificare
	char sql[1000]; //codul care este executat de sqlite
	const char* data = "Callback function called"; //folosit la select, nu este neaparat necesar

	/* Open database */
	rc = sqlite3_open("test.db", &db);

	if (rc) {
		printf("Can't open database: %s\n", sqlite3_errmsg(db));
		return(0);
	}
	else {
		printf("Opened database successfully\n");
	}

	/* CREATE STATEMENT */
	strcpy(sql,"CREATE TABLE COMPANY("  \
			"ID INT PRIMARY KEY     NOT NULL," \
			"NAME           TEXT    NOT NULL," \
			"AGE            INT     NOT NULL," \
			"ADDRESS        CHAR(50)," \
			"SALARY         REAL );");

	/* Execute SQL statement */
	rc = sqlite3_exec(db, sql, NULL, 0, &zErrMsg); //sqlite3_exec este functia de baza pentru executat comenzi sql.

	if (rc != SQLITE_OK) { //daca nu s-a executat corect
		printf("SQL error: %s\n", zErrMsg);
		sqlite3_free(zErrMsg);
	}
	else { //daca s-a executat corect
		printf("Table created successfully\n");
	}

	/* INSERT STATEMENT */
	strcpy(sql, "INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY) "  \
		"VALUES (1, 'Paul', 32, 'California', 20000.00 ); " \
		"INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY) "  \
		"VALUES (2, 'Allen', 25, 'Texas', 15000.00 ); "     \
		"INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)" \
		"VALUES (3, 'Teddy', 23, 'Norway', 20000.00 );" \
		"INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)" \
		"VALUES (4, 'Mark', 25, 'Rich-Mond ', 65000.00 );");

	/* SELECT STATEMENT */
	rc = sqlite3_exec(db, sql, NULL, 0, &zErrMsg);

	if (rc != SQLITE_OK) {
		printf("SQL error: %s\n", zErrMsg);
		sqlite3_free(zErrMsg);
	}
	else {
		printf("Records created successfully\n");
	}

	strcpy(sql, "SELECT * from COMPANY");
	/*
		aici se foloseste functia de callback de sus.
		(void*)data e folosit doar pentru o afisare simpla, nu este neaparat necesar aici
	*/
	rc = sqlite3_exec(db, sql, callback, (void*)data, &zErrMsg); 

	if (rc != SQLITE_OK) {
		fprintf(stderr, "SQL error: %s\n", zErrMsg);
		sqlite3_free(zErrMsg);
	}
	else {
		fprintf(stdout, "Operation done successfully\n");
	}

	/*
		Daca vrei sa folosesti selecturi custom, spre exemplu SELECT * from COMPANY where id = n, cu n variabil, poti sa faci asa
		folosesc biblioteca string ca sa convertesc de la int la string
		s e un fel de "stringbuilder" din java
	*/
	auto s = std::to_string(rand() % 4 + 1);

	sprintf(sql,"%s%s","SELECT * FROM COMPANY WHERE ID = ",s.c_str());

	rc = sqlite3_exec(db, sql, callback, (void*)data, &zErrMsg);
	
	if (rc != SQLITE_OK) {
		fprintf(stderr, "SQL error: %s\n", zErrMsg);
		sqlite3_free(zErrMsg);
	}
	else {
		fprintf(stdout, "Operation done successfully\n");
	}


	sqlite3_close(db); //inchide baza de date.


	system("pause");
	return 0;
}