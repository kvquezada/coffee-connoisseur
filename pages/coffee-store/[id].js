import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from 'classnames';

import styles from '../../styles/coffee-stores.module.css';
import {fetchCoffeeStores} from "../../lib/coffee-stores";

import {StoreContext} from "../../store/store-context";

import {isEmpty} from "../../utils";

export async function getStaticProps(staticProps) {
	console.log('staticProps: ', staticProps)
	const params = staticProps.params;

	const coffeeStores = await fetchCoffeeStores();
	const findCoffeeStoresById = coffeeStores.find(coffeeStore => coffeeStore.id.toString() === params.id);

	return {
		props: {
			coffeeStore: findCoffeeStoresById ? findCoffeeStoresById : {}
		}
	}
}

export async function getStaticPaths() {
	const coffeeStores = await fetchCoffeeStores();
	const paths = coffeeStores.map(coffeesStore => {
		return {
			params: {
				id: coffeesStore.id.toString(),
			}
		}
	})
	return {
		paths,
		fallback: true,
	}
}

// initialProps coming from getStaticProps
const CoffeeStore = (initialProps) => {
	const router = useRouter();
	console.log('router', router);

	if (router.isFallback) {
		return <div>Loading...</div>
	}

	const id = router.query.id;

	const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

	const {
		state: {coffeeStores},
	} = useContext(StoreContext);

	useEffect(() => {
		if (isEmpty(initialProps.coffeeStore)) {
			if(coffeeStores.length > 0) {
				const findCoffeeStoresById = coffeeStores.find(coffeeStore => coffeeStore.id.toString() === id);
				setCoffeeStore(findCoffeeStoresById);
			}
		}
	}, [id]);

	const { address, name, neighborhood, imgUrl} = coffeeStore;

	const handleUpvoteButton = () => {
		console.log('handle upvote');
	}

	return (
		<div>
			<Head>
				<title>{name}</title>
			</Head>
			<div className={styles.container}>
				<div className={styles.col1}>
					<div className={styles.backToHomeLink}>
						<Link href='/'><a>← Back to home</a></Link>
					</div>
					<div className={styles.nameWrapper}>
						<h1 className={styles.name}>{name}</h1>
					</div>
					<Image
						src={imgUrl || 'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'}
						width={600}
						height={360}
						className={styles.storeImg}
						alt={name}/>
				</div>
				<div className={cls("glass", styles.col2)}>
					{address && (
						<div className={styles.iconWrapper}>
							<Image src="/static/icons/nearMe.svg" width="24" height="24" alt="icon 3"/>
							<p className={styles.text}>{address}</p>
						</div>
					)}
					{neighborhood && (
						<div className={styles.iconWrapper}>
							<Image src="/static/icons/places.svg" width="24" height="24" alt="icon 3"/>
							<p className={styles.text}>{neighborhood}</p>
						</div>
					)}
					<div className={styles.iconWrapper}>
						<Image src="/static/icons/star.svg" width="24" height="24" alt="icon 3"/>
						<p className={styles.text}>1</p>
					</div>

					<button className={styles.upvoteButton} onClick={handleUpvoteButton}>Upvote!</button>
				</div>
			</div>
		</div>
	)
}

export default CoffeeStore;