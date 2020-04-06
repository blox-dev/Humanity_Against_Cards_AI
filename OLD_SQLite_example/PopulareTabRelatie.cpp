#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <string>
#include "sqlite3.h"

int intrebari[100], raspunsuri[100];
int poz1 = 0, poz2 = 0;

static int callback1(void *data, int argc, char **argv, char **azColName) {
	int i;
	for (i = 0; i < argc; i++) {
		intrebari[poz1++] = atoi(argv[i]);
	}
	return 0;
}

static int callback2(void *data, int argc, char **argv, char **azColName) {
	int i;
	for (i = 0; i < argc; i++) {
		raspunsuri[poz2++] = atoi(argv[i]);
	}
	return 0;
}

static int callback3(void *data, int argc, char **argv, char **azColName) {
	int i;
	printf("%s: ", (const char*)data);

	for (i = 0; i < argc; i++) {
		printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
	}

	printf("\n");
	return 0;
}


int main()
{
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

	strcpy(sql, "DROP TABLE Relatie;");
	rc = sqlite3_exec(db, sql, NULL, 0, &zErrMsg);
	if (rc != SQLITE_OK) {
		fprintf(stderr, "SQL error: %s\n", zErrMsg);
		sqlite3_free(zErrMsg);
	}
	else {
		fprintf(stdout, "Table deleted successfully\n");
	}

	/* CREATE STATEMENT */
	strcpy(sql, "CREATE TABLE Relatie(" \
		"id_intrebare    INTEGER NOT NULL," \
		"id_raspuns      INTEGER NOT NULL," \
		"valoare_globala INTEGER," \
		"categorie       TEXT," \
		"CONSTRAINT fk_relatie_id_intrebare FOREIGN KEY(id_intrebare) REFERENCES intrebari(id)," \
		"CONSTRAINT fk_relatie_id_raspuns   FOREIGN KEY(id_raspuns)   REFERENCES raspunsuri(id));");

	/* Execute SQL statement */
	rc = sqlite3_exec(db, sql, NULL, 0, &zErrMsg); //sqlite3_exec este functia de baza pentru executat comenzi sql.

	if (rc != SQLITE_OK) { //daca nu s-a executat corect
		printf("SQL error: %s\n", zErrMsg);
		sqlite3_free(zErrMsg);
	}
	else { //daca s-a executat corect
		printf("Table created successfully\n");
	}

	
	for (int i = 0; i < 5; i++) {
		sprintf(sql, "SELECT id FROM intrebari WHERE id = %d", i+1);
		rc = sqlite3_exec(db, sql, callback1, 0, &zErrMsg);
	}

	for (int i = 0; i < 30; i++) {
		sprintf(sql, "SELECT id FROM raspunsuri WHERE id = %d", i+1);
		rc = sqlite3_exec(db, sql, callback2, 0, &zErrMsg);
	}

	int i, j;
	for (i = 0; i < poz1; i++)
	{
		for (j = 0; j < poz2; j++)
		{
			sprintf(sql, "INSERT INTO Relatie (id_intrebare, id_raspuns, valoare_globala, categorie)" \
				"VALUES (%d, %d, %d, NULL); ", intrebari[i], raspunsuri[j], rand() % 10 + 11);
			rc = sqlite3_exec(db, sql, callback3, 0, &zErrMsg);
		}
	}

	if (rc != SQLITE_OK) {
		fprintf(stderr, "SQL error: %s\n", zErrMsg);
		sqlite3_free(zErrMsg);
	}
	else {
		fprintf(stdout, "Insert Operation done successfully\n");
	}

	strcpy(sql, "SELECT * from Relatie");
	rc = sqlite3_exec(db, sql, callback3, (void*)data, &zErrMsg);

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