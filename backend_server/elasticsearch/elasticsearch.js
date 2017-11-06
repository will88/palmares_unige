const elasticsearch = require('elasticsearch');
const logger = require('../logdna'); // optional logger

// Elasticsearch instance details. Replace 'process.env.REACT_APP_SEARCHLY_URL' with 'localhost:9200' if running locally.
const es = elasticsearch.Client({
    host: process.env.REACT_APP_SEARCHLY_URL,
    log: 'trace'
});

const INDEX_NAME = 'students';
const INDEX_TYPE = 'details';


function indexExists() {
    return es.indices.exists({
        index: INDEX_NAME
    });
}

// index creation using settings suggested by searchkit docs
function createIndex(){
    return es.indices.create({
        index: INDEX_NAME,
        body: {
            "analysis": {
                "char_filter": {
                    "replace": {
                        "type": "mapping",
                        "mappings": [
                            "&=> and "
                        ]
                    }
                },
                "filter": {
                    "word_delimiter" : {
                        "type" : "word_delimiter",
                        "split_on_numerics" : false,
                        "split_on_case_change" : true,
                        "generate_word_parts" : true,
                        "generate_number_parts" : true,
                        "catenate_all" : true,
                        "preserve_original":true,
                        "catenate_numbers":true
                    }
                },
                "analyzer": {
                    "default": {
                        "type": "custom",
                        "char_filter": [
                            "html_strip",
                            "replace"
                        ],
                        "tokenizer": "whitespace",
                        "filter": [
                            "lowercase",
                            "word_delimiter"
                        ]
                    }
                }
            }
        }
    });
}
function deleteIndex(){
    return es.indices.delete({
        index: INDEX_NAME
    });
}

function indexMapping(){
    return es.indices.putMapping({
        index: INDEX_NAME,
        type: INDEX_TYPE,
        body: {
            properties: {
                studentname: {
                    type: "text",
                    // analyzer: "default",
                    // search_analyzer: "default",
                },
                degreename: {
                    type: "text"
                },
                degreeyear: {
                    type: "integer"
                },
                degreemonth: {
                    type: "text",
                },
            }
        }
    });
}

let bulk = [];

// add all our students to our 'bulk' array and then execute a callback that executes indexAll with it.
function bulkPush(allstudents){
    for (let current in allstudents){
        bulk.push(
            { index: {_index: INDEX_NAME, _type: INDEX_TYPE} },
            {
                'studentname': allstudents[current].student,
                'degreename': allstudents[current].degree,
                'degreeyear': allstudents[current].year,
                'degreemonth': allstudents[current].month,
            }
        );
    }
    logger.logger.log("Students bulk data ready");
    indexAll(bulk);
    //callback(bulk);
}

function indexAll (bulkstudentsarray) {
    return es.bulk({
        maxRetries: 5,
        index: INDEX_NAME,
        type: INDEX_TYPE,
        body: bulkstudentsarray,
        refresh: "true"
    }).then(
        function () {
            logger.logger.log('Student documents have been imported');
        },
        function (err) {
            logger.logger.error('Could not import student data', err);
        }
    );
}

exports.deleteIndex = deleteIndex;
exports.createIndex = createIndex;
exports.indexExists = indexExists;
exports.indexMapping = indexMapping;
exports.indexAll = indexAll;
exports.bulkPush = bulkPush;