import { MongoClient } from "mongodb";
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";

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
    const client = MongoClient.connect(databaseURL);
    const db = (await client).db();
    const meetupsCollection = db.collection("meetups");

    meetups = await meetupsCollection.find().toArray();

    (await client).close();
  } catch (error) {
    throw new Error("Failed to fetch meetups");
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
