#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <iostream>
#include <stdlib.h>
#include "sqlite3.h" 
#include <string>
#include <ctime>

int fitness[7];
int poz = 0;

int raspunsAI(sqlite3* db, int argc, char** argv);
void selectAnswers(sqlite3* db, int blackCardId, int* whiteCardId);
static int callback(void *data, int argc, char **argv, char **azColName);
int wheelOfFortune();
int select(int* wheel);

int main(int argc, char* argv[]) {
	sqlite3 *db; 
	int rc = sqlite3_open("test.db", &db);
	if (rc) {
		printf("Can't open database: %s\n", sqlite3_errmsg(db));
		return(0);
	}
	else {
		printf("Opened database successfully\n");
	}
	int raspuns=raspunsAI(db, argc, argv);
	std::cout << raspuns << std::endl;
	sqlite3_close(db); 

	system("pause");
	return raspuns;
}

int select(int* wheel) {
	//TODO: find a different random
	srand(time(0));
	int x = rand() % wheel[6];
	for (int i = 0; i < 7; i++) {
		if (x < wheel[i])
			return i;
	}
	return 6;
}

int wheelOfFortune() {
	int wheel[7];
	wheel[0] = fitness[0];
	for (int i = 1; i < 7; i++)
		wheel[i] = wheel[i - 1] + fitness[i];
	return select(wheel);

}

static int callback(void *data, int argc, char **argv, char **azColName) {
	int i;
	for (i = 0; i < argc; i++) {
		fitness[poz++] = atoi(argv[i]);
	}
	return 0;
}

void selectAnswers(sqlite3* db, int blackCardId, int* whiteCardId) {
	char *zErrMsg = 0;
	int rc;
	char sql[1000];
	for (int i = 0; i < 7; i++) {
		//sprintf(sql, "SELECT valoare FROM relatie WHERE id_black = %d AND id_white = %d", blackCardId, whiteCardId[i]);
		//cea de sus ar trebuii sa fie interogarea corecta, pe moment nu poate fi folosita din pricina inexistentei tabelului
		sprintf(sql, "select id from raspunsuri where id = %d", i + 1);
		rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);
	}
}

int raspunsAI(sqlite3* db, int argc, char** argv) {
	//TODO: check if argc & argv are valid
	int blackCardId = atoi(argv[2]);
	int whiteCardId[7];
	for (int i = 3; i < argc; i++)
		whiteCardId[i - 3] = atoi(argv[i]);
	selectAnswers(db, blackCardId, whiteCardId);
	int var = wheelOfFortune();
	return whiteCardId[var];
}
