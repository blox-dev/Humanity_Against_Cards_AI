// PopulateDB.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <string>
#define _CRT_SECURE_NO_WARNINGS 1
/*
#include "sqlite3.h" 
public void insert(JsonObject jsonObject) {
    ContentValues values = new ContentValues();
    SQLiteDatabase db = this.getWritableDatabase();
    values.put("shopName", jsonObject.getString('Hello World'));
    values.put("shopTeluguName", jsonObject.getString('shopTeluguName'));
    values.put("shopAddress", jsonObject.getString('shopAddress'));
    values.put("previousDues", jsonObject.getString('previousDues'));
    values.put("shopID", jsonObject.getString('shopID'));

    db.insert("YOUR TABLE NAME", null, values);
}
*/
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
    /*
    CREATE TABLE[IF NOT EXISTS] Blacks(
        text TEXT NOT NULL,
        pick INTEGER CHECK(pick>0)
    );
    CREATE TABLE[IF NOT EXISTS] Whites(
        text TEXT NOT NULL
    );
    */
    FILE* file;
    char linie[256];
    fopen_s(&file,"C:/Users/Eu/Cards.txt", "r");
        if (file != NULL)
        {
            while (fgets(linie, 256, file) != NULL) {
                printf("Am citit %s", linie);
                if (strchr(linie, '?') != NULL) //BLACK cu intrebare
                    printf("1\n");//INSERT INTO Blacks VALUES(linie, 1); 
                else if (strchr(linie, '_') != NULL) //BLACK cu spatii
                    printf("%d\n", aparitii(linie, '_')); //INSERT INTO Blacks VALUES(linie, aparitii(linie, '_');
                else
                        printf("3\n");//    INSERT INTO Whites VALUES(linie);
                printf("\n");
            }
            fclose(file);
        }
        return 0;
}

// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
