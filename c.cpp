#include <emscripten.h>
#include <iostream>

using namespace std;

const int MaxWidth = 1000;
const int MaxHeight = 1000;

typedef short int tRow[MaxWidth];

typedef tRow tRawGrid[MaxHeight];

struct tGrid
{
    tRawGrid contents;
    tRawGrid active;

    int height = 0;
    int width = 0;
};

int main()
{
    return 0;
}

tGrid mem;

bool AwinsB(int a, int b)
{
    if (a == b)
    {
        return false;
    }
    if (a == 0)
    {
        return false;
    }
    if (b == 0)
    {
        return true;
    }
    return (a) % 3 == b - 1;
}

void clear(tGrid &mem)
{
    for (int y = 0; y < mem.height; y++)
    {
        for (int x = 0; x < mem.width; x++)
        {
            mem.contents[y][x] = 0;
        }
    }
}

void EMSCRIPTEN_KEEPALIVE initJS(int h, int w)
{
    mem.height = h;
    mem.width = w;
    clear(mem);
}
void actualize(int x, int y)
{
    const int deltaX[8] = {0, 0, 1, -1, 1, 1, -1, -1};
    const int deltaY[8] = {1, -1, 0, 0, -1, 1, -1, 1};
    for (int i = 0; i < 8; i++)
    {
        mem.active[(y + deltaY[i]) % mem.height][(x + deltaX[i]) % mem.width] = true;
    }
}

void EMSCRIPTEN_KEEPALIVE setXYVJS(int x, int y, int v)
{
    mem.contents[y][x] = v;
    mem.active[y ][x] = true;
    actualize(x, y);
}

void printMem()
{
    for (int y = 0; y < mem.height; y++)
    {
        for (int x = 0; x < mem.width; x++)
        {
            cout << mem.contents[y][x];
        }
        cout << endl;
    }
}

void EMSCRIPTEN_KEEPALIVE stepJS()
{
    printMem();
    tGrid next = mem;
    for (int y = 0; y < next.height; y++)
    {
        for (int x = 0; x < next.width; x++)
        {
            next.active[y][x] = false;
        }
    }
    

    for (int y = 0; y < mem.height; y++)
    {
        for (int x = 0; x < mem.width; x++)
        {
            if (mem.active[y][x] == 1)
            {
                int persistence = 0;
                const int deltaX[8] = {0, 0, 1, -1, 1, 1, -1, -1};
                const int deltaY[8] = {1, -1, 0, 0, -1, 1, -1, 1};

                int sesinoDX = 0;
                int sesinoDY = 0;

                for (int i = 0; i < 8; i++)
                {

                    if (AwinsB(mem.contents[y][x], mem.contents[(y + deltaY[i]) % mem.height][(x + deltaX[i]) % mem.width]))
                    {
                        persistence++;
                    }
                    if (AwinsB(mem.contents[y + deltaY[i]][x + deltaX[i]], mem.contents[y][x]))
                    {
                        sesinoDX = deltaX[i];
                        sesinoDY = deltaY[i];

                        persistence--;
                    }
                }
                if (persistence >= 0)
                {
                    next.contents[y][x] = mem.contents[y][x];
                    next.active[y][x] = 1;
                }
                else if (persistence < 0)
                {
                    mem.contents[y + sesinoDY][x + sesinoDX] = next.contents[y][x];
                    next.active[y][x] = 1;
                }
                if (persistence != 0)
                {
                    actualize(x, y);
                }
            }
        }
    }
    mem = next;
}


int transmitionProgress = -1;
int transmitionY = 0;
int transmitionX = 0;

void EMSCRIPTEN_KEEPALIVE startTransmisionJS()
{
    transmitionProgress = -1;
    transmitionY = 0;
    transmitionX = 0;
}

int EMSCRIPTEN_KEEPALIVE transmitJS()
{
    if (transmitionProgress == -1)
    {
        transmitionProgress = 0;
        return mem.height;
    }
    if (transmitionProgress == 0)
    {
        transmitionProgress = 1;
        return mem.width;
    }
    if (transmitionProgress == 1)
    {
        int ret = mem.contents[transmitionY][transmitionX];
        transmitionX++;
        if (transmitionX == mem.width)
        {
            transmitionX = 0;
            transmitionY++;
            if (transmitionY == mem.height)
            {
                transmitionProgress = 2;
                transmitionY = 0;
                transmitionX = 0;
            }
        }
        return ret;
    }
    if (false || transmitionProgress == 2)
    {
        int ret = mem.active[transmitionY][transmitionX];
        transmitionX++;
        if (transmitionX == mem.width)
        {
            transmitionX = 0;
            transmitionY++;
            if (transmitionY == mem.height)
            {
                transmitionProgress = 3;
                transmitionY = 0;
                transmitionX = 0;
            }
        }
        return ret;
    }
    return 0;
}
