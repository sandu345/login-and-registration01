const db = require("./initialization")
 const collectionList = {

    userCollection:db.collection("UserCollection"),
    developerCollection:db.collection("DeveloperCollection"),
    adminCollection:db.collection("AdminCollection"),
    customerCollection:db.collection("CustomerCollection"),
    bankDataCollection:db.collection("BankDataCollection"),
    adTypeCollection:db.collection("AdTypeCollection"),
    adUnitCollection:db.collection("AdUnitCollection"),
    gameTypeCollection:db.collection("GameTypeCollection"),
    gameCollection:db.collection("GameCollection"),
    logCollection:db.collection("LogCollection"),
    notificationCollection:db.collection("NotificationCollection"),
    complainCollection:db.collection("ComplainCollection"),
    transactionCollection:db.collection("TransactionCollection"),
    advertisementCollection:db.collection("AdvertisementCollection"),


}
module.exports = collectionList;
