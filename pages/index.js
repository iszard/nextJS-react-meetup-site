import { MongoClient } from "mongodb";
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";
import { databaseURL } from "../src/database";

function HomePage(props) {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

// export async function getServerSideProps(context) {
//   const { req, res } = context;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  let meetups = [];

  let client = null;
  try {
    client = await MongoClient.connect(databaseURL);
  } catch (error) {
    const msg = JSON.stringify(error);
    throw new Error("Failed to connect to client", msg);
  }

  let db = null;
  try {
    db = client.db();
  } catch (error) {
    const msg = JSON.stringify(error);
    throw new Error("Failed to create db instance", msg);
  }

  let meetupsCollection = null;
  try {
    meetupsCollection = db.collection("meetups");
  } catch (error) {
    const msg = JSON.stringify(error);
    throw new Error("Failed to get collection", msg);
  }

  try {
    meetups = await meetupsCollection.find().toArray();
  } catch (error) {
    const msg = JSON.stringify(error);
    throw new Error("Failed to find data in collection", msg);
  }

  try {
    client.close();
  } catch (error) {
    const msg = JSON.stringify(error);
    throw new Error("Failed to close DB connection", msg);
  }

  try {
    const client = MongoClient.connect(databaseURL);
    const db = client.db();
    const meetupsCollection = db.collection("meetups");

    meetups = await meetupsCollection.find().toArray();

    client.close();
  } catch (error) {
    throw new Error("Failed to fetch meetups", error);
  }

  return {
    props: {
      meetups: meetups?.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
