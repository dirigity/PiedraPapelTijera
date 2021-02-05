#include <emscripten.h>
#include <iostream>

using namespace std;

const int MaxWidth = 1000;
const int MaxHeight = 1000;

typedef short int tRow[MaxWidth];

typedef tRow tRawGrid[MaxHeight];

const int esquinas = 4;

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

    if (!(a > -1 && a < 4 && b > -1 && b < 4))
    {
        return false;
    }

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
    if (h > MaxHeight || w > MaxWidth)
    {
        cout << "jddalfñajsdfñaldskfjañsldkjasdñflkasjdfñlasdfkjañdklgfjlfdghjeirutqpewoiruqwpeoriuqwperoiquwerpoqwiepqwozm,xcvnbz,mvcnzbxcv,zmxncvz,mcxvnbz" << endl;
    }
    mem.height = h;
    mem.width = w;
    clear(mem);
}
void actualize(tGrid &mem, int x, int y)
{
    const int deltaX[8] = {0, 0, 1, -1, 1, 1, -1, -1};
    const int deltaY[8] = {1, -1, 0, 0, -1, 1, -1, 1};
    for (int i = 0; i < esquinas; i++)
    {
        mem.active[(y + deltaY[i]) % mem.height][(x + deltaX[i]) % mem.width] = true;
    }
}

void EMSCRIPTEN_KEEPALIVE setXYVJS(int x, int y, int v)
{
    mem.contents[y][x] = v;
    mem.active[y][x] = true;
    actualize(mem, x, y);
}

void printMem()
{
    return;
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
    //cout << "step" << endl;
    printMem();
    tGrid next = mem;
    for (int y = 0; y < next.height; y++)
    {
        for (int x = 0; x < next.width; x++)
        {
            next.active[y][x] = 0;
        }
    }

    for (int y = 0; y < mem.height; y++)
    {
        for (int x = 0; x < mem.width; x++)
        {
            if (mem.active[y][x] == 1)
            {
                const int deltaX[8] = {0, 0, 1, -1, 1, 1, -1, -1};
                const int deltaY[8] = {1, -1, 0, 0, -1, 1, -1, 1};
                int a = mem.contents[y][x];

                //cout << "a:" << a << endl;
                int puntuation = 0;
                int PermanentB = -1;
                for (int i = 0; i < esquinas; i++)
                {
                    if (y + deltaY[i] > 0 && x + deltaX[i] > 0 && y + deltaY[i] < mem.height-1 && x + deltaX[i] < mem.width-1)
                    {
                        int b = mem.contents[y + deltaY[i]][x + deltaX[i]];
                        //cout << "b:" << b << endl;

                        if (AwinsB(b, a))
                        {
                            puntuation--;
                            PermanentB = b;
                        }
                        else if(AwinsB(a,b)){
                            puntuation++;
                        }
                    }
                }
                if (puntuation < 0)
                {

                    next.contents[y][x] = PermanentB;
                    actualize(next, x, y);
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
