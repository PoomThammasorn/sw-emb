const admin = require("firebase-admin");

const getData = (req, res) => {
  const databaseRef = admin.database().ref("/"); // Replace with the path to your data in the Realtime Database

  databaseRef.once(
    "value",
    (snapshot) => {
      const data = snapshot.val();
      //console.log(data);
      res.json(data);
    },
    (error) => {
      console.error(error);
      res.status(500).send("Error retrieving data from the database.");
    }
  );
};

module.exports = {
  getData,
};
