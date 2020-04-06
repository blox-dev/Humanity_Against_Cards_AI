#include <iostream>
#include <string>
#include "sqlite3.c"
#include "sqlite3.h"

int aparitii(char* linie, char ch) {
    int count = 0;
    int i = 0;
    do {
        if (linie[i] == ch)
            count++;
    } while (linie[i++]);
    return count;
}
int main()
{
    CREATE TABLE[IF NOT EXISTS] Blacks(
        text TEXT NOT NULL,
        pick INTEGER CHECK(pick>0)
    );
    CREATE TABLE[IF NOT EXISTS] Whites(
        text TEXT NOT NULL
    );
    
    FILE* file;
    char linie[256];
    fopen_s(&file,"C:/Users/Eu/Cards.txt", "r");
        if (file != NULL)
        {
            while (fgets(linie, 256, file) != NULL) {
                if (strchr(linie, '?') != NULL) //BLACK cu intrebare
                    INSERT INTO Blacks VALUES(linie, 1); 
                else if (strchr(linie, '_') != NULL) //BLACK cu spatii
                    INSERT INTO Blacks VALUES(linie, aparitii(linie, '_');
                else
                    INSERT INTO Whites VALUES(linie);
            }
            fclose(file);
        }
        return 0;
}
