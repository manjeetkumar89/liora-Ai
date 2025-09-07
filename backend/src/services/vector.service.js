const {Pinecone}= require('@pinecone-database/pinecone');

const pc = new Pinecone({apiKey: process.env.PINECONE_API_KEY});


//liora is the name of index which we have created in the pinecone
const lioraIndex = pc.Index('liora');

//create memory function will store user messages and their embeddings
async function createMemory({vectors, metadata, messageId}) {
    // upsert method is used to insert or update documents in the index
    await lioraIndex.upsert([{
        id : messageId,
        values : vectors,
        metadata
    }])
}

//query memory function will retrieve user messages and their embeddings
async function queryMemory({queryVector, limit=5, metadata}) {
    const data = await lioraIndex.query({
        vector: queryVector,
        topK: limit, // Limit the number of results returned
        filter: metadata? metadata : undefined, 
        includeMetadata: true
    })
    return data.matches;
}


module.exports = {
    createMemory,
    queryMemory
}