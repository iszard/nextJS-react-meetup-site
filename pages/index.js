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

  try {
    const client = await MongoClient.connect(databaseURL);
    const db = client.db();
    const meetupsCollection = db.collection("meetups");

    meetups = await meetupsCollection.find().toArray();

    client.close();
  } catch (error) {
    const msg = JSON.stringify(error);
    throw new Error(`Failed to fetch meetups, error: ${msg}`);
  }

  return {
    props: {
      meetups: meetups?.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id?.toString(),
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
