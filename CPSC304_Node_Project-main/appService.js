const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchLanguagetableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Language');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertLanguage(Name, Status, FamilyName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Language (Name, Status, FamilyName) VALUES (:Name, :Status, :FamilyName)`,
            [Name, Status, FamilyName],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameLanguage(oldName, newStatus, newFamily) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Language SET Status=:newStatus, FamilyName=:newFamily where Name=:oldName`,
            {
                newStatus: newStatus, 
                newFamily: newFamily, 
                oldName: oldName 
            },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function getNameLanguage(oldName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Status, FamilyName FROM Language WHERE Name=:oldName',
        [oldName]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchLanguageSpeakers(languageName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT Speaker.Name, Dialect.Name 
            FROM Speaker, Dialect, SpokenBy 
            WHERE Dialect.LanguageName=:languageName 
            AND SpokenBy.SpeakerID = Speaker.ID 
            AND Dialect.Name = SpokenBy.DialectName 
            AND SpokenBy.LanguageName = Dialect.LanguageName`,
        [languageName]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchMaxSpeakers(languageName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT IsFrom.CountryName, COUNT(*) AS SpeakerCount
     FROM Dialect
     INNER JOIN SpokenBy ON SpokenBy.LanguageName = Dialect.LanguageName 
                        AND SpokenBy.DialectName = Dialect.Name
     INNER JOIN Speaker ON SpokenBy.SpeakerID = Speaker.ID
     INNER JOIN IsFrom ON IsFrom.SpeakerID = Speaker.ID
     WHERE Dialect.LanguageName = :languageName
     GROUP BY IsFrom.CountryName
     HAVING COUNT(*) = (
         SELECT MAX(SpeakerCount)
         FROM (
             SELECT COUNT(*) AS SpeakerCount
             FROM Dialect
             INNER JOIN SpokenBy ON SpokenBy.LanguageName = Dialect.LanguageName 
                                AND SpokenBy.DialectName = Dialect.Name
             INNER JOIN Speaker ON SpokenBy.SpeakerID = Speaker.ID
             INNER JOIN IsFrom ON IsFrom.SpeakerID = Speaker.ID
             WHERE Dialect.LanguageName = :languageName
             GROUP BY IsFrom.CountryName
         )
     )`,
        [languageName]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function deleteLanguage(inputName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`DELETE FROM Language WHERE Name=:inputName`,
        [inputName],
        { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function getPopulationSum() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT Language.Name, SUM(Dialect.population)
            FROM Language, Dialect 
            WHERE Dialect.LanguageName=Language.name 
            GROUP BY Language.Name`,
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getAncientLanguages() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT Language.Name, MAX(WritingSystem.Age)
            FROM Language, WritingSystem, Uses
            WHERE Language.Name = Uses.LanguageName
            AND WritingSystem.Name = Uses.WSName 
            GROUP BY Language.Name
            HAVING MAX(WritingSystem.Age) > 1000`,
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

module.exports = {
    testOracleConnection,
    fetchLanguagetableFromDb,
    initiateDemotable, 
    insertLanguage, 
    updateNameLanguage, 
    getNameLanguage, 
    deleteLanguage,
    fetchLanguageSpeakers,
    getPopulationSum,
    getAncientLanguages,
    fetchMaxSpeakers
};