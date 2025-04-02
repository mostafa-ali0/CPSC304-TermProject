DROP TABLE Family CASCADE CONSTRAINTS;
DROP TABLE Country CASCADE CONSTRAINTS;
DROP TABLE WritingSystem CASCADE CONSTRAINTS;
DROP TABLE Unicode CASCADE CONSTRAINTS;
DROP TABLE Word CASCADE CONSTRAINTS;
DROP TABLE Speaker CASCADE CONSTRAINTS;
DROP TABLE PlaceInfo CASCADE CONSTRAINTS;
DROP TABLE Language CASCADE CONSTRAINTS;
DROP TABLE Uses CASCADE CONSTRAINTS;
DROP TABLE Dialect CASCADE CONSTRAINTS;
DROP TABLE IsFrom CASCADE CONSTRAINTS;
DROP TABLE SpokenBy CASCADE CONSTRAINTS;
DROP TABLE SpokenIn CASCADE CONSTRAINTS;
DROP TABLE Defines CASCADE CONSTRAINTS;
DROP TABLE Phoneme CASCADE CONSTRAINTS;
DROP TABLE Vowel CASCADE CONSTRAINTS;
DROP TABLE Consonant CASCADE CONSTRAINTS;
DROP TABLE Contains CASCADE CONSTRAINTS;

-- 1. Create independent tables first
CREATE TABLE Family (
    Name VARCHAR2(255) PRIMARY KEY,
    Origin VARCHAR2(255)
);

CREATE TABLE Country (
    Name VARCHAR2(255) PRIMARY KEY,
    Continent VARCHAR2(255),
    Population INTEGER
);

CREATE TABLE WritingSystem (
    Name VARCHAR2(255) PRIMARY KEY,
    Type VARCHAR2(255),
    Age INTEGER
);

CREATE TABLE Unicode (
    UnicodeID INTEGER PRIMARY KEY,
    UnicodeBlock VARCHAR2(255)
);

CREATE TABLE Word (
    ID INTEGER PRIMARY KEY,
    WrittenForm NVARCHAR2(255),
    Meaning VARCHAR2(255)
);

CREATE TABLE Speaker (
    ID VARCHAR2(255) PRIMARY KEY,
    Name VARCHAR2(255)
);

CREATE TABLE PlaceInfo (
    Place VARCHAR2(255) PRIMARY KEY,
    Coronal VARCHAR2(255)
);

-- 2. Create tables that reference the above tables
CREATE TABLE Language (
    Name VARCHAR2(255) PRIMARY KEY,
    Status VARCHAR2(255),
    FamilyName VARCHAR2(255) NOT NULL,
    FOREIGN KEY (FamilyName) REFERENCES Family(Name)
);

CREATE TABLE Uses (
    WSName VARCHAR2(255),
    LanguageName VARCHAR2(255),
    PRIMARY KEY (LanguageName, WSName),
    FOREIGN KEY (WSName) REFERENCES WritingSystem(Name),
    FOREIGN KEY (LanguageName) REFERENCES Language(Name) ON DELETE CASCADE
);

CREATE TABLE Dialect (
    Name VARCHAR2(255),
    LanguageName VARCHAR2(255) NOT NULL,
    Population INTEGER,
    PRIMARY KEY (Name, LanguageName),
    FOREIGN KEY (LanguageName) REFERENCES Language(Name) ON DELETE CASCADE
);

CREATE TABLE IsFrom (
    SpeakerID VARCHAR2(255),
    CountryName VARCHAR2(255),
    PRIMARY KEY (SpeakerID, CountryName),
    FOREIGN KEY (SpeakerID) REFERENCES Speaker(ID),
    FOREIGN KEY (CountryName) REFERENCES Country(Name)
);

CREATE TABLE SpokenBy (
    SpeakerID VARCHAR2(255),
    DialectName VARCHAR2(255),
    LanguageName VARCHAR2(255),
    PRIMARY KEY (SpeakerID, DialectName, LanguageName),
    FOREIGN KEY (SpeakerID) REFERENCES Speaker(ID),
    FOREIGN KEY (DialectName, LanguageName) REFERENCES Dialect(Name, LanguageName)  ON DELETE CASCADE
);

CREATE TABLE SpokenIn (
    CountryName VARCHAR2(255),
    DialectName VARCHAR2(255),
    LanguageName VARCHAR2(255),
    PRIMARY KEY (CountryName, DialectName, LanguageName),
    FOREIGN KEY (CountryName) REFERENCES Country(Name),
    FOREIGN KEY (DialectName, LanguageName) REFERENCES Dialect(Name, LanguageName) ON DELETE CASCADE
);

CREATE TABLE Defines (
    WordID INTEGER,
    DialectName VARCHAR2(255),
    LanguageName VARCHAR2(255),
    PRIMARY KEY (WordID, DialectName, LanguageName),
    FOREIGN KEY (WordID) REFERENCES Word(ID),
    FOREIGN KEY (DialectName, LanguageName) REFERENCES Dialect(Name, LanguageName) ON DELETE CASCADE
);

-- 3. Create tables for phonetic data
CREATE TABLE Phoneme (
    IPANumber INTEGER PRIMARY KEY,
    Unicode INTEGER,
    FOREIGN KEY (Unicode) REFERENCES Unicode(UnicodeID)
);

CREATE TABLE Vowel (
    IPANumber INTEGER PRIMARY KEY,
    Height VARCHAR2(255),
    Backness VARCHAR2(255),
    Rounded NUMBER(1),
    FOREIGN KEY (IPANumber) REFERENCES Phoneme(IPANumber)
);

CREATE TABLE Consonant (
    IPANumber INTEGER PRIMARY KEY,
    Voiced NUMBER(1),
    Place VARCHAR2(255),
    Manner VARCHAR2(255),
    FOREIGN KEY (IPANumber) REFERENCES Phoneme(IPANumber),
    FOREIGN KEY (Place) REFERENCES PlaceInfo(Place)
);

CREATE TABLE Contains (
    IPANumber INTEGER,
    WordID INTEGER,
    PRIMARY KEY (IPANumber, WordID),
    FOREIGN KEY (IPANumber) REFERENCES Phoneme(IPANumber),
    FOREIGN KEY (WordID) REFERENCES Word(ID)
);

-- INSERT statements
-- Family Table
INSERT INTO Family (Name, Origin) VALUES ('Indo-European', 'Pontic-Caspian steppe');
INSERT INTO Family (Name, Origin) VALUES ('Afro-Asiatic', 'East Africa');
INSERT INTO Family (Name, Origin) VALUES ('Niger-Congo', 'Savanna belt of West Africa');
INSERT INTO Family (Name, Origin) VALUES ('Salish', 'Pacific Northwest');
INSERT INTO Family (Name, Origin) VALUES ('Koreanic', 'Korean Peninsula');

-- Country Table
INSERT INTO Country (Name, Continent, Population) VALUES ('Canada', 'North America', 38000000);
INSERT INTO Country (Name, Continent, Population) VALUES ('France', 'Europe', 67000000);
INSERT INTO Country (Name, Continent, Population) VALUES ('Kenya', 'Africa', 55000000);
INSERT INTO Country (Name, Continent, Population) VALUES ('South Korea', 'Asia', 52000000);
INSERT INTO Country (Name, Continent, Population) VALUES ('Saudi Arabia', 'Asia', 35000000);
INSERT INTO Country (Name, Continent, Population) VALUES ('Democratic Republic of the Congo', 'Africa', 92000000);
INSERT INTO Country (Name, Continent, Population) VALUES ('Egypt', 'Africa', 107000000);
INSERT INTO Country (Name, Continent, Population) VALUES ('United Kingdom', 'Europe', 68350000);

-- WritingSystem Table
INSERT INTO WritingSystem (Name, Type, Age) VALUES ('Latin', 'Alphabet', 2700);
INSERT INTO WritingSystem (Name, Type, Age) VALUES ('Arabic', 'Abjad', 1800);
INSERT INTO WritingSystem (Name, Type, Age) VALUES ('North American Phonetic Alphabet', 'Alphabet', 160);
INSERT INTO WritingSystem (Name, Type, Age) VALUES ('Hangul', 'Featural Alphabet', 582);
INSERT INTO WritingSystem (Name, Type, Age) VALUES ('Chinese', 'Logographic', 3000);

-- Unicode Table
INSERT INTO Unicode (UnicodeID, UnicodeBlock) VALUES (98, 'Latin');
INSERT INTO Unicode (UnicodeID, UnicodeBlock) VALUES (111, 'Latin');
INSERT INTO Unicode (UnicodeID, UnicodeBlock) VALUES (110, 'Latin');
INSERT INTO Unicode (UnicodeID, UnicodeBlock) VALUES (660, 'Arabic');
INSERT INTO Unicode (UnicodeID, UnicodeBlock) VALUES (629, 'Arabic');
INSERT INTO Unicode (UnicodeID, UnicodeBlock) VALUES (109, 'Latin');
INSERT INTO Unicode (UnicodeID, UnicodeBlock) VALUES (641, 'Arabic');
INSERT INTO Unicode (UnicodeID, UnicodeBlock) VALUES (616, 'Arabic');
INSERT INTO Unicode (UnicodeID, UnicodeBlock) VALUES (652, 'Latin');
INSERT INTO Unicode (UnicodeID, UnicodeBlock) VALUES (712, 'Arabic');

-- Word Table
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (1, N'bonjour', 'hello');
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (2, N'hello', 'greeting');
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (3, N'salama', 'peace');
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (4, N'안녕', 'hello');
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (5, N'مرحبا', 'hello');
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (6, N'hən̓q̓', 'hello');
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (7, N'merci', 'thank you');
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (8, N'habari', 'news');
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (9, N'네', 'yes');
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (10, N'شكرًا', 'thank you');
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (11, N'érablière', 'maple grove');
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (12, N'souper', 'dinner');
INSERT INTO Word (ID, WrittenForm, Meaning) VALUES (13, N'toque', 'hat');

-- Speaker Table
INSERT INTO Speaker (ID, Name) VALUES (1, 'John Smith');
INSERT INTO Speaker (ID, Name) VALUES (2, 'Marie Dubois');
INSERT INTO Speaker (ID, Name) VALUES (3, 'Ali Hassan');
INSERT INTO Speaker (ID, Name) VALUES (4, 'Ji-hoon Park');
INSERT INTO Speaker (ID, Name) VALUES (5, 'Amina Mwangi');
INSERT INTO Speaker (ID, Name) VALUES (6, 'William Johnson');
INSERT INTO Speaker (ID, Name) VALUES (7, 'Sophie Lefevre');
INSERT INTO Speaker (ID, Name) VALUES (8, 'Fatima Al-Farsi');

-- PlaceInfo Table
INSERT INTO PlaceInfo (Place, Coronal) 
VALUES ('bilabial', 0);

INSERT INTO PlaceInfo (Place, Coronal) 
VALUES ('alveolar', 1);

INSERT INTO PlaceInfo (Place, Coronal) 
VALUES ('glottal', 0);

INSERT INTO PlaceInfo (Place, Coronal) 
VALUES ('uvular', 0);

INSERT INTO PlaceInfo (Place, Coronal) 
VALUES ('palatal', 1);

-- Language Table
INSERT INTO Language (Name, Status, FamilyName) VALUES ('English', 'International', 'Indo-European');
INSERT INTO Language (Name, Status, FamilyName) VALUES ('French', 'International', 'Indo-European');
INSERT INTO Language (Name, Status, FamilyName) VALUES ('German', 'International', 'Indo-European');
INSERT INTO Language (Name, Status, FamilyName) VALUES ('Arabic', 'International', 'Afro-Asiatic');
INSERT INTO Language (Name, Status, FamilyName) VALUES ('Swahili', 'National', 'Niger-Congo');
INSERT INTO Language (Name, Status, FamilyName) VALUES ('Halkomelem', 'Moribund', 'Salish');
INSERT INTO Language (Name, Status, FamilyName) VALUES ('Korean', 'National', 'Koreanic');

-- Uses Table
INSERT INTO Uses (LanguageName, WSName) VALUES ('English', 'Latin');
INSERT INTO Uses (LanguageName, WSName) VALUES ('Swahili', 'Latin');
INSERT INTO Uses (LanguageName, WSName) VALUES ('French', 'Latin');
INSERT INTO Uses (LanguageName, WSName) VALUES ('Swahili', 'Arabic');
INSERT INTO Uses (LanguageName, WSName) VALUES ('Arabic', 'Arabic');
INSERT INTO Uses (LanguageName, WSName) VALUES ('Halkomelem', 'North American Phonetic Alphabet');
INSERT INTO Uses (LanguageName, WSName) VALUES ('Korean', 'Hangul');
INSERT INTO Uses (LanguageName, WSName) VALUES ('Korean', 'Chinese');

-- Dialect Table
INSERT INTO Dialect (Name, LanguageName, Population) VALUES ('Quebecois', 'French', 7700000);
INSERT INTO Dialect (Name, LanguageName, Population) VALUES ('Metropolitan', 'French', 64000000);
INSERT INTO Dialect (Name, LanguageName, Population) VALUES ('Coastal', 'Swahili', 15000000);
INSERT INTO Dialect (Name, LanguageName, Population) VALUES ('Gulf', 'Arabic', 36000000);
INSERT INTO Dialect (Name, LanguageName, Population) VALUES ('Egyptian', 'Arabic', 40000000);
INSERT INTO Dialect (Name, LanguageName, Population) VALUES ('Jeju', 'Korean', 5000);
INSERT INTO Dialect (Name, LanguageName, Population) VALUES ('Pyojuneo', 'Korean', 51000000);
INSERT INTO Dialect (Name, LanguageName, Population) VALUES ('Canadian', 'English', 30000000);
INSERT INTO Dialect (Name, LanguageName, Population) VALUES ('British', 'English', 60000000);
INSERT INTO Dialect (Name, LanguageName, Population) VALUES ('Downriver', 'Halkomelem', 4);
INSERT INTO Dialect (Name, LanguageName, Population) VALUES ('Belgian', 'French', 4500000);
INSERT INTO Dialect (Name, LanguageName, Population) VALUES ('Belgian', 'German', 77527);

-- SpokenBy Table
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (1, 'Canadian', 'English');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (1, 'Quebecois', 'French');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (2, 'Quebecois', 'French');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (3, 'Gulf', 'Arabic');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (4, 'Jeju', 'Korean');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (5, 'Coastal', 'Swahili');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (6, 'Canadian', 'English');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (7, 'British', 'English');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (7, 'Metropolitan', 'French');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (8, 'Gulf', 'Arabic');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (8, 'British', 'English');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (1, 'British', 'English');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (2, 'British', 'English');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (6, 'Downriver', 'Halkomelem');
INSERT INTO SpokenBy (SpeakerID, DialectName, LanguageName) VALUES (7, 'Coastal', 'Swahili');

-- SpokenIn Table
INSERT INTO SpokenIn (CountryName, DialectName, LanguageName) VALUES ('Canada', 'Canadian', 'English');
INSERT INTO SpokenIn (CountryName, DialectName, LanguageName) VALUES ('Canada', 'Quebecois', 'French');
INSERT INTO SpokenIn (CountryName, DialectName, LanguageName) VALUES ('France', 'Quebecois', 'French');
INSERT INTO SpokenIn (CountryName, DialectName, LanguageName) VALUES ('Kenya', 'Coastal', 'Swahili');
INSERT INTO SpokenIn (CountryName, DialectName, LanguageName) VALUES ('Democratic Republic of the Congo', 'Coastal', 'Swahili');
INSERT INTO SpokenIn (CountryName, DialectName, LanguageName) VALUES ('South Korea', 'Jeju', 'Korean');
INSERT INTO SpokenIn (CountryName, DialectName, LanguageName) VALUES ('Saudi Arabia', 'Gulf', 'Arabic');
INSERT INTO SpokenIn (CountryName, DialectName, LanguageName) VALUES ('Canada', 'Downriver', 'Halkomelem');
INSERT INTO SpokenIn (CountryName, DialectName, LanguageName) VALUES ('United Kingdom', 'British', 'English');

-- Defines Table
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (1, 'Quebecois', 'French');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (1, 'Metropolitan', 'French');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (1, 'Belgian', 'French');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (2, 'Canadian', 'English');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (2, 'British', 'English');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (3, 'Coastal', 'Swahili');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (4, 'Jeju', 'Korean');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (5, 'Gulf', 'Arabic');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (5, 'Egyptian', 'Arabic');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (6, 'Downriver', 'Halkomelem');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (7, 'Quebecois', 'French');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (7, 'Metropolitan', 'French');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (7, 'Belgian', 'French');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (8, 'Coastal', 'Swahili');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (9, 'Jeju', 'Korean');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (10, 'Gulf', 'Arabic');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (10, 'Egyptian', 'Arabic');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (11, 'Quebecois', 'French');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (12, 'Belgian', 'French');
INSERT INTO Defines (WordID, DialectName, LanguageName) VALUES (13, 'Canadian', 'English');

-- IsFrom Table
INSERT INTO IsFrom (SpeakerID, CountryName) 
VALUES (1, 'Canada');
INSERT INTO IsFrom (SpeakerID, CountryName) 
VALUES (2, 'France');
INSERT INTO IsFrom (SpeakerID, CountryName) 
VALUES (3, 'Kenya');
INSERT INTO IsFrom (SpeakerID, CountryName) 
VALUES (4, 'South Korea');
INSERT INTO IsFrom (SpeakerID, CountryName) 
VALUES (5, 'Kenya');
INSERT INTO IsFrom (SpeakerID, CountryName) 
VALUES (6, 'Canada');
INSERT INTO IsFrom (SpeakerID, CountryName) 
VALUES (7, 'France');
INSERT INTO IsFrom (SpeakerID, CountryName) 
VALUES (8, 'Saudi Arabia');

-- Phoneme Table
INSERT INTO Phoneme (IPANumber, Unicode) VALUES (101, 98);
INSERT INTO Phoneme (IPANumber, Unicode) VALUES (102, 111);
INSERT INTO Phoneme (IPANumber, Unicode) VALUES (103, 110);
INSERT INTO Phoneme (IPANumber, Unicode) VALUES (104, 660);
INSERT INTO Phoneme (IPANumber, Unicode) VALUES (105, 629);
INSERT INTO Phoneme (IPANumber, Unicode) VALUES (106, 109);
INSERT INTO Phoneme (IPANumber, Unicode) VALUES (107, 641);
INSERT INTO Phoneme (IPANumber, Unicode) VALUES (108, 616);
INSERT INTO Phoneme (IPANumber, Unicode) VALUES (109, 652);
INSERT INTO Phoneme (IPANumber, Unicode) VALUES (110, 712);

-- Vowel Table
INSERT INTO Vowel (IPANumber, Height, Backness, Rounded) VALUES (102, 'close-mid', 'back', 1);
INSERT INTO Vowel (IPANumber, Height, Backness, Rounded) VALUES (105, 'close-mid', 'central', 1);
INSERT INTO Vowel (IPANumber, Height, Backness, Rounded) VALUES (108, 'close', 'central', 0);
INSERT INTO Vowel (IPANumber, Height, Backness, Rounded) VALUES (109, 'open-mid', 'back', 1);
INSERT INTO Vowel (IPANumber, Height, Backness, Rounded) VALUES (110, 'high-mid', 'front', 0);

-- Consonant Table
INSERT INTO Consonant (IPANumber, Voiced, Place, Manner) VALUES (101, 1, 'bilabial', 'plosive');
INSERT INTO Consonant (IPANumber, Voiced, Place, Manner) VALUES (103, 1, 'alveolar', 'nasal');
INSERT INTO Consonant (IPANumber, Voiced, Place, Manner) VALUES (104, 0, 'glottal', 'plosive');
INSERT INTO Consonant (IPANumber, Voiced, Place, Manner) VALUES (106, 1, 'bilabial', 'nasal');
INSERT INTO Consonant (IPANumber, Voiced, Place, Manner) VALUES (107, 1, 'uvular', 'trill');

-- Contains Table
INSERT INTO Contains (IPANumber, WordID) VALUES (101, 1);
INSERT INTO Contains (IPANumber, WordID) VALUES (102, 1);
INSERT INTO Contains (IPANumber, WordID) VALUES (103, 1);
INSERT INTO Contains (IPANumber, WordID) VALUES (106, 3);
INSERT INTO Contains (IPANumber, WordID) VALUES (107, 5);
INSERT INTO Contains (IPANumber, WordID) VALUES (104, 6);
INSERT INTO Contains (IPANumber, WordID) VALUES (108, 8);
INSERT INTO Contains (IPANumber, WordID) VALUES (109, 9);
INSERT INTO Contains (IPANumber, WordID) VALUES (110, 10);

