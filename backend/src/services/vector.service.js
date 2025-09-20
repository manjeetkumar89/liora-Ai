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

async function deleteAllMemoriesOfChat(chatId) {
    try {
        // Uncomment this to debug metadata structure
        // const testQuery = await lioraIndex.query({
        //     vector: new Array(768).fill(0),
        //     topK: 1,
        //     filter : { chatId: chatId.toString() },
        //     includeMetadata: true
        // });
        // console.log('Debug - Sample vector metadata:', testQuery.matches[0]?.metadata);
        
        // Try a simpler filter syntax
        const res = await lioraIndex.deleteMany({
            
            chatId: { $eq: chatId.toString() },
        
        });
        return res;
    } catch (error) {
        console.error('Error deleting memories from Pinecone:', error);
        console.error('ChatId used in filter:', chatId.toString());
        throw error;
    }
}

module.exports = {
    createMemory,
    queryMemory,
    deleteAllMemoriesOfChat
}