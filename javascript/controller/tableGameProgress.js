const tableGameProgressApplication = angular.module("myGameApplication", []);

tableGameProgressApplication.controller("myTableGameProgressController", function ($scope)
{
    // Reading and filtering the data from the trello cards

    let xhr = new XMLHttpRequest(); // Creating an XML Http Request

    // Creating an XML HTTP Request
    xhr.open('GET', 'https://trello.com/b/1lD8Fo21.json', true); // Reading the XML file from a website

    xhr.onreadystatechange = function()
    {
        $scope.$apply(function ()
        {
            if (xhr.readyState === 4)
            {
                let entireJSONFile = JSON.parse(xhr.responseText); // Storing the parsed XML file

                const cardsJSON         = entireJSONFile.cards;                                         // Stores all the cards across all the boards

                const trelloBoardLists = findBoardList(entireJSONFile.lists);                          // Store the broad list
                const trelloCheckLists  = findChecklist(entireJSONFile.checklists);                     // Store the check lists
                const trelloJobLists    = findJobList(entireJSONFile.customFields[0].options);          // Store the job lists (for some reason custom field index is switched)
                const trelloCategory    = findCategories(entireJSONFile.customFields[2].options);       // Stores the category (for some reason custom field index is switched)

                const trelloCards       = findGameCards(cardsJSON, trelloBoardLists, trelloCheckLists, trelloJobLists, trelloCategory); // Populating the game cards

                $scope.searchTaskAttribute = ""; // Responsible for storing the value that is going to be searched
                $scope.trelloBoardLists = trelloBoardLists;
                $scope.trelloCards = trelloCards;
            }
        });
    };

    xhr.send(null); // Send null to XHR

    $scope.removeSpace = function(wordToRemoveSpaces)
    {
        return wordToRemoveSpaces.replace(/ /g, "");
    };

    $scope.calculatePercentage = function(checkListToCalculate)
    {
        let percentageCompleted = 0;

        for (i = 0; i < checkListToCalculate.length; i++)
        {
            if (checkListToCalculate[i].isTaskCompleted === true)   {   percentageCompleted ++; }
        }

        return ((percentageCompleted / checkListToCalculate.length) * 100).toFixed(2);
    };
});

tableGameProgressApplication.filter("trelloCardsFilter", function ()
{
    return function(trelloCards, currentBoard, searchTaskAttribute)
    {
        const filteredTasksArray = [];

        for (i = 0; i < trelloCards.length; i++)
        {
            if (trelloCards[i].cardBoardName === currentBoard &&
                (trelloCards[i].cardName.toLowerCase().indexOf(searchTaskAttribute) !== -1 ||
                    trelloCards[i].cardJob.toLowerCase().indexOf(searchTaskAttribute) !== -1 ||
                    (trelloCards[i].cardEstimation + " days").indexOf(searchTaskAttribute) !== -1 ||
                    trelloCards[i].cardDescription.toLowerCase().indexOf(searchTaskAttribute) !== -1))
            {
                filteredTasksArray.push(trelloCards[i]);
            }
        }

        return filteredTasksArray;
    }
});

function findBoardList(boardListJSON)
{
    const trelloBoardLists = [];

    for (i = 0; i < boardListJSON.length; i++) {
        trelloBoardLists.push({
            boardId: boardListJSON[i].id,
            boardName: boardListJSON[i].name
        });
    }

    return trelloBoardLists;
}

function findChecklist(checkListJSON)
{
    const trelloCheckLists = [];

    for (let i = 0; i < checkListJSON.length; i++) {
        const trelloActualCheckLists = [];

        for (let j = 0; j < checkListJSON[i].checkItems.length; j++) {
            trelloActualCheckLists.push({
                taskName: checkListJSON[i].checkItems[j].name,
                isTaskCompleted: checkListJSON[i].checkItems[j].state === "complete"
            });
        }

        trelloCheckLists.push({
            checkListIdCard: checkListJSON[i].idCard,
            checkListName: checkListJSON[i].name,
            checkListActualList: trelloActualCheckLists
        });
    }

    return trelloCheckLists;
}

function findJobList(jobPluginJSON)
{
    const trelloJobLists = [];

    for (i = 0; i < jobPluginJSON.length; i++) {
        trelloJobLists.push({
            jobId: jobPluginJSON[i].id,
            jobName: jobPluginJSON[i].value.text
        });
    }

    return trelloJobLists;
}

function findCategories(categoryJSON)
{
    const trelloCategory = [];

    for (i = 0; i < categoryJSON.length; i++) {
        trelloCategory.push({
            categoryId: categoryJSON[i].id,
            categoryName: categoryJSON[i].value.text
        });
    }

    return trelloCategory;
}

function findGameCards(cardsJSON, trelloBoardLists, trelloCheckLists, trelloJobLists, trelloCategory)
{
    const trelloCards = [];

    for (i = 0; i < cardsJSON.length; i++) {
        let cardEstimationAvailable = cardsJSON[i].customFieldItems[1] !== undefined && cardsJSON[i].customFieldItems[1].idCustomField === "5a98670ad6afbd6de1c8a9cc";
        let cardJobAvailable = cardsJSON[i].customFieldItems[2] !== undefined && cardsJSON[i].customFieldItems[2].idCustomField === "5a98670ad6afbd6de1c8a9c3";
        let cardCategoryAvailable = cardsJSON[i].customFieldItems[0] !== undefined && cardsJSON[i].customFieldItems[0].idCustomField === "5a98670ad6afbd6de1c8a9ce";

        trelloCards.push({
            cardBoardName: getCardBoard(cardsJSON[i].idList, trelloBoardLists),
            cardName: cardsJSON[i].name,
            cardDescription: cardsJSON[i].desc.length > 0 ? cardsJSON[i].desc : "Description Unassigned",
            cardListName: getCardListName(cardsJSON[i].id, trelloCheckLists),
            cardListActual: getCardListActual(cardsJSON[i].id, trelloCheckLists),
            cardLabelName: cardsJSON[i].labels.length > 0 ? cardsJSON[i].labels[0].name : "Label Name Unassigned",
            cardLabelColor: cardsJSON[i].labels.length > 0 ? cardsJSON[i].labels[0].color : "Label Colour Unassigned",
            cardEstimation: cardEstimationAvailable ? cardsJSON[i].customFieldItems[1].value.number : "Estimation Unknown",
            cardJob: cardJobAvailable ? getJobTitle(cardsJSON[i].customFieldItems[2].idValue, trelloJobLists) : "Job Unassigned",
            cardCategory: cardCategoryAvailable ? getCategoryTitle(cardsJSON[i].customFieldItems[0].idValue, trelloCategory) : "Category Unassigned"
        });
    }

    return trelloCards;
}

function getCardBoard(boardId, trelloBoardLists)
{
    for (let k = 0; k < trelloBoardLists.length; k++) {
        if (trelloBoardLists[k].boardId === boardId)
        {
            return trelloBoardLists[k].boardName;
        }
    }

    return undefined;
}

function getCardListName(cardListIdCard, trelloCheckLists)
{
    for (let i = 0; i < trelloCheckLists.length; i++) {
        if (trelloCheckLists[i].checkListIdCard === cardListIdCard)
        {
            return trelloCheckLists[i].checkListName;
        }
    }

    return undefined;
}

function getCardListActual(checkListIdCard, trelloCheckLists)
{
    for (let i = 0; i < trelloCheckLists.length; i++) {
        if (trelloCheckLists[i].checkListIdCard === checkListIdCard)
        {
            return trelloCheckLists[i].checkListActualList;
        }
    }

    return undefined;
}

function getJobTitle(jobId, trelloJobLists)
{
    for (let i = 0; i < trelloJobLists.length; i ++) {
        if (trelloJobLists[i].jobId === jobId)
        {
            return trelloJobLists[i].jobName;
        }
    }

    return "Job Unassigned";
}

function getCategoryTitle(categoryId, trelloCategory)
{
    for (let k = 0; k < trelloCategory.length; k++) {
        if (trelloCategory[k].categoryId === categoryId)
        {
            return trelloCategory[k].categoryName;
        }
    }

    return "Category Unassigned";
}

function printFormattedData(trelloCards)
{
    for (i = 0; i < trelloCards.length; i++) { // For every trello card
        document.body.innerHTML += `${trelloCards[i].cardBoardName} | ${trelloCards[i].cardName} | ${trelloCards[i].cardDescription} | ${trelloCards[i].cardListName} | <br><br>`;

        if (trelloCards[i].cardListActual !== undefined)
        {
            for (j = 0; j < trelloCards[i].cardListActual.length; j++)
            {
                document.body.innerHTML += `${trelloCards[i].cardListActual[j].taskName} ${trelloCards[i].cardListActual[j].isTaskCompleted} | `;
            }
        }
        else
        {
            document.body.innerHTML += trelloCards[i].cardListActual + " | ";
        }

        document.body.innerHTML +=
            `<br><br>${trelloCards[i].cardLabelName} | ${trelloCards[i].cardLabelColor} | ${trelloCards[i].cardEstimation} | ${trelloCards[i].cardJob} | ${trelloCards[i].cardCategory}
             <br><br> ---------------------------------------------------------------------- <br><br>`;
    }
}
