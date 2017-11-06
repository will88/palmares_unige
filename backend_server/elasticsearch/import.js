const logger = require('../logdna');
const elasticsearch = require('./elasticsearch');
const inputfile = require("../data/students.json");

elasticsearch.indexExists().then(
    //delete index if it exist
    function(status){
        if(status){
            return elasticsearch.deleteIndex();
        }
    }
).then(
    function(){
        logger.logger.log('Index deleted');
        //create our index
        return elasticsearch.createIndex().then(
            function(){
                logger.logger.log('Index created');
                //Update our index with mappings
                elasticsearch.indexMapping().then(
                    function(){
                        logger.logger.log('Index mapping has been updated');
                        //bulk add our students into ./data/students.json
                        elasticsearch.bulkPush(inputfile)
                    },
                    function(err){
                        logger.logger.error('Could not create index', err);
                    }
                )
            },
            function (err){
                logger.logger.error('Could not create index', err);
            }
        );
    }
);
