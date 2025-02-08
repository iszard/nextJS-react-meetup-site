import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { databaseURL } from "../../src/database";

function MeetupDetailPage({ meetupData }) {
  return (
    <>
      <Head>
        <title>{meetupData?.title}</title>
        <meta name="description" content={meetupData?.description} />
      </Head>
      <MeetupDetail
        image={meetupData?.image}
        title={meetupData?.title}
        address={meetupData?.address}
        description={meetupData?.description}
      />
    </>
  );
}

export async function getStaticPaths(context) {
  try {
    const client = await MongoClient.connect(databaseURL);
    const db = client.db();
    const meetupsCollection = db.collection("meetups");

    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

    client.close();

    return {
      fallback: "blocking",
      paths: meetups.map((meetup) => ({
        params: { meetupId: meetup._id.toString() },
      })),
    };
  } catch (error) {
    throw new Error("Failed to fetch meetups");
  }
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  try {
    const client = await MongoClient.connect(databaseURL);
    const db = client.db();
    const meetupsCollection = db.collection("meetups");

    const selectedMeetup = await meetupsCollection.findOne({
      _id: new ObjectId(meetupId),
    });

    client.close();

    return {
      props: {
        meetupData: {
          id: selectedMeetup._id?.toString(),
          title: selectedMeetup.title,
          address: selectedMeetup.address,
          image: selectedMeetup.image,
          description: selectedMeetup.description,
        },
      },
    };
  } catch (error) {
    throw new Error("Failed to fetch meetups");
  }
}

export default MeetupDetailPage;
