import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

import Banner from '../components/banner';
import Card from "../components/card";

import {fetchCoffeeStores} from "../lib/coffee-stores";

import useTrackLocation from '../hooks/use-track-location';
import {useContext, useEffect, useState} from "react";

import {ACTION_TYPES, StoreContext} from "../store/store-context";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  console.log({coffeeStores});
  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  console.log({props});
  const {
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation
  } = useTrackLocation();
  // const  [ coffeeStores, setCoffeeStores ] = useState("");
  const  [ coffeeStoresError, setCoffeeStoresError ] = useState(null);

  const {dispatch, state} = useContext(StoreContext);

  const {coffeeStores, latLong} = state;

  console.log({latLong, locationErrorMsg});

  useEffect(async () => {
    if (latLong) {
      try {
        const res = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`);
        const fetchedCoffeeStores = await res.json();
        dispatch({
          type: ACTION_TYPES.SET_COFFEE_STORES,
          payload: { coffeeStores: fetchedCoffeeStores},
        })
        // setCoffeeStores(fetchedCoffeeStores);
        console.log({fetchedCoffeeStores});
        setCoffeeStoresError('');
      } catch (e) {
        //set error message
        setCoffeeStoresError(e.message);
        console.log({error: e});
      }
    }
  }, [latLong]);

  const handleOnBannerClick = () => {
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View Stores Nearby"}
          handleOnClick={handleOnBannerClick}/>
        { locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        { coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" alt="hero image" width={700} height={400}/>
        </div>

        {/* gets the coffeeStore data from the api after clicking button */}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores Near Me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={coffeeStore.imgUrl || 'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'}
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}/>
                );
              })}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Malate Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={coffeeStore.imgUrl || 'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'}
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}/>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
