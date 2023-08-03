const collectionList = require("../../service/Collections");

 async function getUserCollection(user_id, user_type) {
    try {

        if(user_type == "admin"){
            return await collectionList.adminCollection.doc(user_id).get();
        }
        if(user_type == "customer"){
            return await collectionList.customerCollection.doc(user_id).get();
        }
        if(user_type == "developer"){
            return await collectionList.developerCollection.doc(user_id).get();
        }

        

    } catch (error) {
        console.error(error);
    }
}

async function getUserCollections( user_type) {
    try {

        if(user_type == "admin"){
            return await collectionList.adminCollection.get();
        }
        if(user_type == "customer"){
            return await collectionList.customerCollection.get();
        }
        if(user_type == "developer"){
            return await collectionList.developerCollection.get();
        }

        

    } catch (error) {
        console.error(error);
    }
}




module.exports = {getUserCollection, getUserCollections}

