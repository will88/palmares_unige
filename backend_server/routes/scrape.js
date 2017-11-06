const express = require('express');
const router = express.Router();
const request = require('superagent');
require('superagent-charset')(request); // adds charset support for superagent
const cheerio = require('cheerio');
const links = require('./links');
const fs = require('fs');

class Student {
    constructor(studentName, degreeName, year, month) {
        this.student = studentName;
        this.degree = degreeName;
        this.year = year;
        this.month = month;
    }
}

let trimmedPersonArray = [];
let degreeNameTrimmed = "";
let objectArray = [];
// function scraper(link) {

//router.get('/', function (req, res, next) {
// iterate the scraper over each link (each link is the graduating group of a semester)
for (let singleUrl in links.arrayDates) {
    let semester = links.arrayDates[singleUrl];
    let url = semester.url;

    request
        .get(url)
        // charset encoding set to iso-8859-1 for legacy pages that all have 'static' in their URL, else UTF-8
        .charset(url.includes("static") ? "iso-8859-1" : "utf-8")
        .end(function (err, response) {
            if (err) {
                // res.json({
                //     confirmation: 'fail',
                //     message: err

                // })
                return
            }
            $ = cheerio.load(response.text);


            let totalStudentCount = 0;


            // delete empty h4 tags.
            $('h4').each(function () {
                if (!$(this).text() || !$(this).text().trim())
                    $(this).remove();
            });

            // For each degree
            $('h4').each(function (i, element) {

                // get the degree name.
                let degreeName = element.children[0].data;
                //console.log(degreeName);
                let personString = "";
                let nextNode = getNextNode($(this)[0]);
                let nextNodeText = nextNode ? nextNode.data : '';

                // function to get the next sibling node
                function getNextNode(node) {
                    while (node && (node = node.nextSibling)) {
                        // is a TEXT_NODE
                        if (node.nodeType === 3) {
                            return node;
                        }
                    }
                    return null
                }


                // to handle rare cases where Person text follows the h4 tag.

                // if the next node is a text node


                //'if' statement to fix duplication bug of the 'March 2000' data set.
                if (nextNodeText !== "\n        ") {
                    // IIFE: recursively travel through sibling nodes (unknown depth) and add only person nodes to personString.
                    (function getSiblingPerson(nextNode) {
                        if (nextNode && nextNode.data !== "\n") {
                            // must check if undefined before being able to use trim().
                            if (nextNode.data === undefined) {
                                return getSiblingPerson(nextNode.nextSibling);
                            }
                            // check for separation between h4 degrees in special cases (Mars02).
                            if (nextNode.data.trim() === "") {
                                return;
                            }
                            personString += nextNode.data + "<br>";
                            return getSiblingPerson(nextNode.nextSibling);
                        }
                    })(nextNode);
                }
                //  }

                // to solve issue in Droit Juillet 99

                let standardPersonString = "";

                if ($(this).parent().next().is('blockquote')) {
                    let tempPersonString = $(this).parent().next('blockquote').toString();
                    let end = tempPersonString.indexOf("<h4>");
                     standardPersonString += tempPersonString.slice(0, end);
                }

                // to handle the standard case
                personString += $(this).nextUntil('h4')
                    .toString();
                personString = personString.slice(0, personString.indexOf("<h4>"));
                standardPersonString += personString;


                // .replace(/['"]+/g, '')
                standardPersonString = standardPersonString
                    .replace(/&apos;/g, "'")
                    .replace(/&#xE9;/g, "é")
                    .replace(/&#xE8;/g, "è")
                    .replace(/&#xEF;/g, "ï")
                    .replace(/&#xEE;/g, "î")
                    .replace(/&#x201D;/g, "î")
                    .replace(/&#xE1;/g, "á")
                    .replace(/&#xE4;/g, "ä")
                    .replace(/&#xE2;/g, "â")
                    .replace(/&#xEB;/g, "ë")
                    .replace(/&#xFC;;|&#xFC;/g, 'ü')
                    .replace(/&#x2018;/g, "ë")
                    .replace(/&#xF4;/g, 'ô')
                    .replace(/&#xF2;/g, 'ò')
                    .replace(/&#xF6;/g, 'ö')
                    .replace(/&#xD6;/g, 'Ö')
                    .replace(/&#xEA;/g, 'ê')
                    .replace(/&#xE7;/g, "ç")
                    .replace(/Mikha&#x2022;l/g, "Mikhail");
                // add the student names to an array using split.
                let personArray = standardPersonString.split("<br>");
                //

                // remove <> tags
                trimmedPersonArray = personArray.map(function (string) {
                    return string.replace(/<blockquote>|<\/blockquote>|<\/blockquote|<p>|<a.*>|\n|<\/p>|<\/p|<br>|<br|<\/a|<\/font>|<blink>|<\/blink>|<\/blink|&#xA0;|Fin du corps de page/g, "");
                })
                //
                //     remove <blockquote> OR </blockquote> OR </blockquote or \n or </p> or </p or <br
                    .map(function (string) {
                        return string.replace(/<\/blockquote|\n|<\/p>|<\/p|<br|<\/a|<\/font/g, "");
                    })

                    .map(function (string) {
                        return string.replace(/null|undefined/g, "");
                    })
                    .map(function (string) {
                        return string.trim();
                    })
                    //      // filter out empty strings.
                    .filter(Boolean)
                    //      // filter out <a name> entries //
                    .filter(function (string) {
                        return !string.includes("<font size=");
                    })
                    .filter(function (string) {
                        return !string.includes("<div align=\"left\"");
                    })
                    .filter(function (string) {
                        return !string.includes("<!--#exec");
                    })
                    .filter(function (string) {
                        return !string.includes("Palmarès généré");
                    })
                    .filter(function (string) {
                        return !string.includes("<table");
                    });


                totalStudentCount += trimmedPersonArray.length;

                // console.log("Size of graduating class: " + trimmedPersonArray.length + '\n');


                degreeNameTrimmed = degreeName.toString().replace(/\\n|\\/g, "i").trim();
                // loop to create the students
                for (let student in trimmedPersonArray) {
                    let instance = new Student(trimmedPersonArray[student], degreeNameTrimmed, semester.year, semester.month);
                    objectArray.push(instance);
                }


            });
            console.log("Size of graduating semester " + totalStudentCount);
            console.log(`${semester.month} ${semester.year}`); // console log using ES6 template literals

            console.log(objectArray);
            fs.writeFileSync('./data/students.json', JSON.stringify(objectArray, null, 2), finished);

            function finished(err) {
                console.log('save completed.');


            }
        })


}

module.exports = router;
