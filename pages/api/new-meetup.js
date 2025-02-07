import { MongoClient } from "mongodb";
import { databaseURL } from "../../src/database";

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    // const { title, image, address, description } = data;

    try {
      const client = MongoClient.connect(databaseURL);
      const db = (await client).db();
      const meetupsCollection = db.collection("meetups");

      const result = await meetupsCollection.insertOne(data);

      (await client).close();

      res.status(201).json({ message: "Meetup inserted!" });
    } catch (error) {
      res.status(500).json({ message: "Meetup insertion failed!" });
    }
  }
}

export default handler;
