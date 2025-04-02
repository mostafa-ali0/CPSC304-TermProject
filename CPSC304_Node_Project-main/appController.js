const express = require('express');
const appService = require('./appService');

const router = express.Router();

router.get('/language/:name', (req, res) => {
    res.sendFile(__dirname + '/public/language.html');
});

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/languagetable', async (req, res) => {
    const tableContent = await appService.fetchLanguagetableFromDb();
    res.json({data: tableContent});
});

router.get('/populationsum', async (req, res) => {
    const populationSum = await appService.getPopulationSum();
    res.json({data: populationSum});
});

router.get('/ancientlanguages', async (req, res) => {
    const ancientlanguages = await appService.getAncientLanguages();
    res.json({data: ancientlanguages})
});

router.get('/languagespeakers', async (req, res) => {
    const languageName = req.query.name;
    const tableContent = await appService.fetchLanguageSpeakers(languageName);
    res.json({data: tableContent});
});

router.get('/max-lang-speakers', async (req, res) => {
    const languageName = req.query.name;
    const tableContent = await appService.fetchMaxSpeakers(languageName);
    res.json({data: tableContent});
})

router.get('/words-all-dialects', async (req, res) => {
    const languageName = req.query.name;
    const tableContent = await appService.fetchDefinedWords(languageName);
    res.json({data: tableContent});
})

router.get('/language-status', async (req, res) => {
    const status = req.query.statusFilter;
    const name = req.query.name;
    const comparator = req.query.comparator;
    const age = req.query.age;

    // console.log('SERVER: ', status, name, comparator, age)
    const tableContent = await appService.fetchLanguageStatus(status, name, comparator, age);
    if (tableContent) {
        res.json({ data: tableContent })
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/phoneme-options', async (req, res) => {
    const selectedOptions = req.query.options;
    const options = selectedOptions == undefined ? [] : Array(selectedOptions)

    // console.log("before options: ", options)
    const tableContent = await appService.fetchPhonemeOptions(options);

    if (tableContent) {
        res.json({ data: tableContent })
    } else {
        res.status(500).json({ success: false });
    }
})

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-language", async (req, res) => {
    const { Name, Status, FamilyName } = req.body;
    const insertResult = await appService.insertLanguage(Name, Status, FamilyName);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-language", async (req, res) => {
    const { oldName, newStatus, newFamily } = req.body;
    const currentResult = await appService.getNameLanguage(oldName);
    if (currentResult.length > 0) {
        var inputStatus = newStatus;
        var inputFamily = newFamily;
        if (!newStatus) {
            // console.log(currentResult[0][0]);
            inputStatus = currentResult[0][0];
        }
        if (!newFamily) {
            inputFamily = currentResult[0][1];
        }
        const updateResult = await appService.updateNameLanguage(oldName, inputStatus, inputFamily);
        if (updateResult) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false });
        }
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/delete-language', async (req, res) => {
    const { inputName } = req.body;
    const deleteResult = await appService.deleteLanguage(inputName);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


module.exports = router;