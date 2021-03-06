import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import Banner from '../components/banner';

export default function Home() {
  const handleOnBannerClick = () => {
    console.log('tes button')
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner buttonText="View Stores Nearby" handleOnClick={handleOnBannerClick}/>
      </main>
    </div>
  )
}
