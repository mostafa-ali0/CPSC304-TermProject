/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('languagetable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/languagetable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            if (index == 0) {
                var link = document.createElement("a");
                link.setAttribute("href", `/language/${field}`);
                cell.appendChild(link);
                link.textContent = field;
            } else {
                cell.textContent = field;
            }
        });
        row.insertCell(user.length);
    });
}

async function displayPopulationSum() {
    const tableElement = document.getElementById('languagetable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/populationsum', {
        method: 'GET'
    });

    const responseData = await response.json();
    const populationContent = responseData.data;

    const popMap = new Map();
    populationContent.forEach(([language, total]) => {
        popMap.set(language, total);
    });

    Array.from(tableBody.rows).forEach(row => {
        const langName = row.cells[0].innerText;
        const pop = popMap.get(langName) || 0;

        if (row.cells.length < 4) {
            const cell = row.insertCell(3);
            cell.textContent = pop;
        } else {
            row.cells[3].textContent = pop;
        }
    });
}

async function displayAncientLanguages() {
    const tableElement = document.getElementById('WStable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/ancientlanguages', {
        method: 'GET'
    });

    const responseData = await response.json();
    const content = responseData.data;

    content.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            if (index == 0) {
                var link = document.createElement("a");
                link.setAttribute("href", `/language/${field}`);
                cell.appendChild(link);
                link.textContent = field;
            } else {
                cell.textContent = field;
            }
        });
    });
    
}

async function fetchAndDisplayLanguageStatus(event) {
    event.preventDefault();

    const tableElement = document.getElementById('languagestatus');
    const tableBody = tableElement.querySelector('tbody');

    const name = document.getElementById('lang-name').value;
    const status = document.getElementById('statusSelector').value;
    const ageComparator = document.getElementById('ageComparator').value;
    const age = document.getElementById('ws-age').value;

    const response = await fetch(`/language-status?name=${name}&statusFilter=${status}&comparator=${ageComparator}&age=${age}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            if (index == 0) {
                var link = document.createElement("a");
                link.setAttribute("href", `/language/${field}`);
                cell.appendChild(link);
                link.textContent = field;
            } else {
                cell.textContent = field;
            }
        });
    });
}

async function fetchPhonemeOptions(event) {
    event.preventDefault();

    const form = document.getElementById('phoneme-options-form');
    const formData = new FormData(form);
    const queryString = new URLSearchParams(formData).toString();


    // console.log("QueryString: ", queryString)
    const response = await fetch(`/phoneme-options?${queryString}`, {
        method: 'GET'
    });

    const responseData = await response.json()

    // console.log("This is the response ", response.body)

    const tableData = responseData.metaData ? responseData : responseData.data ? responseData.data : responseData;

    const tableElement = buildTable(tableData);
    const container = document.getElementById('phonemeOptions');
    container.innerHTML = '';
    container.appendChild(tableElement);
}

function buildTable(data) {

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    data.metaData.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.name;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.rows.forEach(rowData => {
        const tr = document.createElement('tr');
        rowData.forEach(cellData => {
            const td = document.createElement('td');
            td.textContent = cellData !== null ? cellData : '-';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    return table;
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertLanguage(event) {
    event.preventDefault();

    const nameValue = document.getElementById('insertName').value;
    const statusValue = document.getElementById('insertStatus').value;
    const familyNameValue = document.getElementById('insertFamilyName').value;

    const response = await fetch('/insert-language', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Name: nameValue,
            Status: statusValue,
            FamilyName: familyNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameLanguage(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newStatusValue = document.getElementById('updateNewStatus').value;
    const newFamilyValue = document.getElementById('updateNewFamily').value;

    const response = await fetch('/update-name-language', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newStatus: newStatusValue,
            newFamily: newFamilyValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function deleteLanguage(event) {
    event.preventDefault();

    const inputName = document.getElementById('inputName').value;
    const response = await fetch("/delete-language", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputName: inputName
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Language deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error deleting language!";
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("insertLanguage").addEventListener("submit", insertLanguage);
    document.getElementById("updataNameLanguage").addEventListener("submit", updateNameLanguage);
    document.getElementById("deleteLanguage").addEventListener("submit", deleteLanguage);
    document.getElementById("showlanguagestatus").addEventListener("submit", fetchAndDisplayLanguageStatus);
    document.getElementById("calculatePop").addEventListener("click", displayPopulationSum);
    document.getElementById("showWS").addEventListener("click", displayAncientLanguages);
    document.getElementById("phoneme-options-form").addEventListener("submit", fetchPhonemeOptions);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
    // fetchAndDisplayLanguageStatus();
}
