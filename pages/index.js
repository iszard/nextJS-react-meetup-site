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
    throw new Error("Failed to connect to client", JSON.stringify(error));
  }

  let db = null;
  try {
    db = client.db();
  } catch (error) {
    throw new Error("Failed to create db instance", JSON.stringify(error));
  }

  let meetupsCollection = null;
  try {
    meetupsCollection = db.collection("meetups");
  } catch (error) {
    throw new Error("Failed to get collection", JSON.stringify(error));
  }

  try {
    meetups = await meetupsCollection.find().toArray();
  } catch (error) {
    throw new Error("Failed to find data in collection", JSON.stringify(error));
  }

  try {
    client.close();
  } catch (error) {
    throw new Error("Failed to close DB connection", JSON.stringify(error));
  }

  // try {
  //   const client = MongoClient.connect(databaseURL);
  //   const db = (await client).db();
  //   const meetupsCollection = db.collection("meetups");

  //   meetups = await meetupsCollection.find().toArray();

  //   (await client).close();
  // } catch (error) {
  //   throw new Error("Failed to fetch meetups", error);
  // }

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
