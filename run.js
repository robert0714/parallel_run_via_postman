/**
 * @fileOverview A sample script to demonstrate parallel collection runs using async.
 */
const path = require('path'); // ensures that the path is consistent, regardless of where the script is run from
const async = require('async'); // https://npmjs.org/package/async
const newman = require('newman'); // change to require('newman'), if using outside this repository

require('dotenv').config()
console.log(`inputData is ${process.env.INPUT_DATA}`);
console.log(`collectionJson is ${process.env.COLLECTION_JSON}`);
console.log(`foders is ${process.env.FOLDERS}`);
console.log(`UUID is ${process.env.UUID}`);
console.log(`BASE_URL is ${process.env.BASE_URL}`);

const inputData = `${process.env.INPUT_DATA}`.split(",");
const collectionJson = `${process.env.COLLECTION_JSON}`;

const uuid =  `${process.env.UUID}`;
const baseUrl =  `${process.env.BASE_URL}`;
const foders = `${process.env.FOLDERS}`; 

const globalVariable=[ { "key": "uuid", "value": uuid } ];
const envVariable=[{ "key":"baseUrl", "value": baseUrl }];

let parallelCollectionRuns = [];
console.log("inputData start."); 

inputData.forEach(element => {
     /**
     * A set of collection run options for the paralle collection runs. For demonstrative purposes in this script, an
     * identical set of options has been used. However, different options can be used, so as to actually run different
     * collections, with their corresponding run options in parallel.
     *
     * @type {Object}
     */
     const options = {
        collection: path.join(__dirname, collectionJson ),
        folder: foders ,
        globalVar: globalVariable,
        envVar: envVariable,
        iterationData: element
     };
     /**
     * A collection runner function that runs a collection for a pre-determined options object.
     *
     * @param {Function} done - A callback function that marks the end of the current collection run, when called.
     */
     const parallelCollectionRun = function (done) {
        //console.log("Started");
        newman.run(options, done);
        //console.log("Finished");
    };
    parallelCollectionRuns.push(parallelCollectionRun)  ;
});
console.log("inputData ok."); 
console.log("async.parallel startup."); 
// Runs the Postman sample collection thrice, in parallel.
async.parallel(parallelCollectionRuns,

/**
 * The
 *
 * @param {?Error} err - An Error instance / null that determines whether or not the parallel collection run
 * succeeded.
 * @param {Array} results - An array of collection run summary objects.
 */
function (err, results) {
    err && console.error(err); 
    results.forEach(function (result) {
        console.log("=====================================================================================================================================================");
        var failures = result.run.failures;
        if (failures) {
            console.error(failures);
        }else{  
            console.log("normal..........");
        }
        console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
            `${result.collection.name} ran successfully.`);

        console.log("");
        console.log("******   API CALLED   ******");
        console.log(JSON.stringify(result.run.executions[0].item.name));

        // console.log("******RESULT STATS******");
        // console.log(JSON.stringify(result.run.stats));

        console.log("");
        console.log("********RESULT TIMING*******");
        console.log( "responseAverage:"+JSON.stringify(result.run.timings.responseAverage)
          +" | Started:"+ new Date(result.run.timings.started) 
          +" | Completed:"+ new Date(result.run.timings.completed) );
    });
    console.log("=====================================================================================================================================================");
});
