function generateDocument(trelloCards, trelloCategory)
{
    let documentationString =
        "%----------------------------------------------------------------------------------------\n" +
        "%\t\t\tCHAPTER\n" +
        "%----------------------------------------------------------------------------------------\n" +
        "\n" +
        "\\begin{document}" +
        "\n" +
        "\\chapterimage{images/titleBackground} % Chapter heading image\n" +
        "\\chapter{Game Tasks}\n\n";

    let documentationImageCount = 0;
    let documentationImages = "<div class='row'>";

    for (let i = 0; i < trelloCards.length; i ++)
    {
        documentationString += "\\begin{longtabu}{|X|XX|} \\hline \\tabuphantomline\n";

        documentationString += "\tName:         & \\multicolumn{2}{p{\\dimexpr 20pt+2\\tabucolX+2\\arrayrulewidth}|}{" + trelloCards[i].cardName + " \\newline} \\\\ \\hline \n";
        documentationString += "\tDescription:  & \\multicolumn{2}{p{\\dimexpr 20pt+2\\tabucolX+2\\arrayrulewidth}|}{" + formatDescription(trelloCards[i].cardDescription) + " \\newline} \\\\ \\hline \n";
        documentationString += "\tRole:         & \\multicolumn{2}{p{\\dimexpr 20pt+2\\tabucolX+2\\arrayrulewidth}|}{" + trelloCards[i].cardJob + " \\newline} \\\\ \\hline \n";
        documentationString += "\tDuration:     & \\multicolumn{2}{p{\\dimexpr 20pt+2\\tabucolX+2\\arrayrulewidth}|}{" + (trelloCards[i].cardEstimation.match(/^-?\d+$/) ? (trelloCards[i].cardEstimation  + " days") : trelloCards[i].cardEstimation) + " \\newline} \\\\ \\hline";

        documentationString += generateCategoryList ("\tCategory: ", trelloCards[i], trelloCategory);

        if (trelloCards[i].cardListActual !== undefined)
        {
            let placeInTwoColumn = true;

            for (let j = 0; j < trelloCards[i].cardListActual.length; j ++)
            {
                if (trelloCards[i].cardListActual[j].taskName.length > 40)  {   placeInTwoColumn = false;  }
            }

            documentationString += generateTasksList ("\tChecklist: ", trelloCards[i], placeInTwoColumn);
        }

        documentationString += "\\end{longtabu}";

        if (trelloCards[i].cardAttachments.length !== 0 && document.getElementsByClassName("documentationImages")[0].childNodes.length === 3) // Indicates the number of elements within the documentation image div
        {
            documentationString += "\n";

            for (let j = 0; j < trelloCards[i].cardAttachments.length; j ++)
            {
                documentationString += "\n\\begin{figure}[ht!]\n";
                documentationString += "\t\\centering \n";
                documentationString += "\t\\includegraphics[width=\\linewidth / 4 * 3]{images/GameTasks/" + trelloCards[i].cardAttachments[j].cardImageName + "} \n";
                documentationString += "\\end{figure} \n";
                documentationString += "\\vspace*{1.5cm}";

                documentationString += (j !== trelloCards[i].cardAttachments.length - 1) ? "\n" : "";

                documentationImages +=  "<div class='col-md-4'>" +
                    "   <img src=\"" + trelloCards[i].cardAttachments[j].cardImageURL + "\">" +
                    "</div>";

                if (documentationImageCount % 3 === 2)  {   documentationImages +=  "</div><div class='row'>"   }

                documentationImageCount ++;
            }
        }

        if (i < (trelloCards.length - 1))   {   documentationString += "\n\n\\clearpage\n\n";     }
        else                                {   documentationString += "\n\\end{document}\n";     }
    }

    let div = document.createElement('div');
    div.innerHTML = documentationImages;

    document.getElementsByClassName("documentationImages")[0].appendChild(div);
    document.getElementsByClassName("imageCount")[0].innerHTML = "You should have <strong>" + documentationImageCount + " images </strong>";

    let latexFile = new Blob([documentationString], {type: "text/plain;charset=utf-8"});
    saveAs(latexFile, "GameTasks.tex");
}

function formatDescription(cardDescription)
{
    let linkedAt = 0;
    let foundBold = false;
    let foundLink = false;
    let stringToReturn = "";

    for (let j = 0; j < cardDescription.length; j ++)
    {
        if (cardDescription.charAt(j) === '*')
        {
            if (cardDescription.charAt(j + 1) === '*')
            {
                if (!foundBold)     {   stringToReturn += "\\textbf{";  }
                else                {   stringToReturn += "}";          }

                foundBold = !foundBold;
            }
        }
        else if (((cardDescription.charAt(j) === 'h' && cardDescription.charAt(j + 1) === 't' && cardDescription.charAt(j + 2) === 't' && cardDescription.charAt(j + 3) === 'p') ||
                 (cardDescription.charAt(j) === 'w' && cardDescription.charAt(j + 1) === 'w' && cardDescription.charAt(j + 2) === 'w')) && !foundLink)
        {
            stringToReturn += "\\textbf{\\textit{\\href{" + cardDescription.charAt(j);

            linkedAt = j;
            foundLink = true;
        }
        else if ((cardDescription.charAt(j) === ' ' || cardDescription.charAt(j) === '\n' || j === (cardDescription.length - 1)) && foundLink)
        {
            stringToReturn += "}{";

            for (let k = linkedAt; k < j - 1; k ++)
            {
                stringToReturn += latexFormatter (cardDescription.charAt(k));
            }

            stringToReturn += "}}}";
            foundLink = false;
        }
        else if (cardDescription.charAt(j) === '\n')
        {
            stringToReturn += "\n\t\t\t\t\t\\newline ";
        }
        else
        {
            stringToReturn += latexFormatter (cardDescription.charAt(j));
        }
    }

    return stringToReturn;
}

function latexFormatter(characterToConvert)
{
    if (characterToConvert === '_')      {   return "\\_";                 }
    else if (characterToConvert === '_') {   return "\\$";                 }
    else                                 {   return characterToConvert;    }
}

function generateCategoryList(listTitle, aTrelloCard, trelloCategory)
{
    let listString = "\n" + listTitle;

    for (let j = 0; j < trelloCategory.length; j ++)
    {
        listString += " \n\t\t& \\begin{todolist}";

        if (trelloCategory[j].categoryName === aTrelloCard.cardCategory)
        {
            listString += " \\item[\\done] " + trelloCategory[j].categoryName;
        }
        else
        {
            listString += " \\item " + trelloCategory[j].categoryName;
        }

        listString += " \\end{todolist}";

        if ((j % 2) === 1)
        {
            listString += " \\\\ \n";
        }
    }

    if ((trelloCategory.length % 2) === 1)      {   listString += " & \\\\ \\hline\n";    }

    return listString;
}


function generateTasksList(listTitle, aTrelloCard, isTwoList)
{
    let listString = "\n" + listTitle;

    if (isTwoList)
    {
        for (let j = 0; j < aTrelloCard.cardListActual.length; j ++)
        {
            listString += "\n\t\t& \\begin{todolist}";

            if (aTrelloCard.cardListActual[j].isTaskCompleted)
            {
                listString += " \\item[\\done] " + aTrelloCard.cardListActual[j].taskName;
            }
            else
            {
                listString += " \\item " + aTrelloCard.cardListActual[j].taskName;
            }

            listString += " \\end{todolist}";

            if ((j % 2) === 1)
            {
                listString += " \\\\\n";
            }
        }

        if ((aTrelloCard.cardListActual.length % 2) === 1)  {   listString += " & \\\\ \\hline \n";     }
        else                                                {   listString += " \\\\ \\hline \n";       }
    }
    else
    {
        listString += " \n\t\t& \\multicolumn{2}{p{\\dimexpr 20pt+2\\tabucolX+2\\arrayrulewidth}|}{";
        listString += "\n\t\t\\begin{todolist}";

        for (let j = 0; j < aTrelloCard.cardListActual.length; j ++)
        {
            if (aTrelloCard.cardListActual[j].isTaskCompleted)
            {
                listString += "\n\t\t\t\\item[\\done] " + aTrelloCard.cardListActual[j].taskName;
            }
            else
            {
                listString += "\n\t\t\t\\item " + aTrelloCard.cardListActual[j].taskName;
            }

            listString += " \\\\ ";
        }

        listString += "\n\t\t\\end{todolist}} \\\\ \\hline \n";
    }

    return listString;
}
