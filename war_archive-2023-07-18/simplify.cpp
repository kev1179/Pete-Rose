#include <iostream>
#include <fstream>
#include <string>
#include <unordered_set>

using namespace std;

void writeToFile(ifstream& batting, ifstream& pitching)
{
	ofstream outFile("names.txt");
	unordered_set<string> names;

	string line;
	int count = 0;
	while(getline(batting, line))
	{
		if(count != 0)
		{
			int firstCommaIndex = line.find_first_of(',');
			string name = line.substr(0, firstCommaIndex);

			if(names.find(name) == names.end())
			{
				outFile << name << endl;
			}

			names.insert(name);
		}
		count++;
	}
	
	count = 0;
	while(getline(pitching, line))
	{
		if(count != 0)
		{
			int firstCommaIndex = line.find_first_of(',');
			string name = line.substr(0, firstCommaIndex);

			if(names.find(name) == names.end())
			{
				outFile << name << endl;
			}

			names.insert(name);
		}
		count++;
	}

	outFile.close();
	batting.close();
	pitching.close();
}

int main()
{
	ifstream batting("war_daily_bat.txt");
	ifstream pitching("war_daily_pitch.txt");
	
	writeToFile(batting, pitching);
}
