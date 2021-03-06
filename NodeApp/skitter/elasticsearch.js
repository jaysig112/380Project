var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var indexName = "skitter";

/**
 * Delete an existing index
 */
function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
 * create the index
 */
function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
 * check if the index exists
 */
function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

function initMapping() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "skit",
        body: {
            properties: {
                name: { type: "string" },
                content: { type: "string" },
                suggest: {
                    type: "completion",
                    analyzer: "simple",
                    search_analyzer: "simple",
                    payloads: true
                }
            }
        }
    });
}
exports.initMapping = initMapping;

function addDocument(skit) {
    return elasticClient.index({
        index: indexName,
        type: "skit",
        body: {
            name: skit.name,
            content: skit.content,
            suggest: {
                input: skit.name.split(" "),
                output: skit.name,
                payload: skit.metadata || {}
            }
        }
    });
}
exports.addDocument = addDocument;


function removeDocument(id) {
    console.log(id.id)
    return elasticClient.delete({
        index: "skitter",
        type: "skit",
        id: id.id
    });
}
exports.removeDocument = removeDocument;

function searchDocuments(input) {
    return elasticClient.search({
        index: "skitter",
        q: 'name:' + input,
        size: 50
    });
}
exports.searchDocuments = searchDocuments;

function getSuggestions(input) {
    return elasticClient.suggest({
        index: "skitter",
        type: "skit",
        body: {
            docsuggest: {
                text: input,
                completion: {
                    field: "suggest",
                    fuzzy: true
                }
            }
        }
    })
}
exports.getSuggestions = getSuggestions;
