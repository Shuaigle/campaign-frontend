import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useEffect } from 'react'
import dateformat from "dateformat"
import Link from 'next/link'
import { useRouter } from 'next/dist/client/router'

export default function Home({ data, error }) {

  useEffect(() => {

    console.log('process.env.NEXT_PUBLIC_BASE_URL :>> ', process.env.NEXT_PUBLIC_BASE_URL)
  }, [])

  const router = useRouter()

  const handleNavigation = ({ slug }) => {
    router.push("/" + slug)
  }

  return (
    <div>
      <Head>
        <title>Campaign Manager: | Home</title>
        <meta name="description" content="A site for managing campaigns" />
      </Head>
      <main className={styles.main}>
        <div className={styles.innerContent}>
          <h1>Available campaigns</h1>
          {/* if error, shows it */}
          {error && <p>{JSON.stringify(error)}</p>}

          {data.map((element) =>
            <div key={element.slug}>
              <div className={styles.item} onClick={() => handleNavigation(element)}>
                <div className={styles.imgContainer}>
                  <Image className={styles.img} src={"https://res.cloudinary.com/dsodgvh31/" + element.logo} height={100} width={100} alt="Campaign Logo" />
                </div>

                <div className={styles.rightItems}>
                  {/* prefetching link */}
                  <Link href={"/" + element.slug}>
                    <a>{element.title}</a>
                  </Link>
                  <p>{element.description}</p>
                  <small>{dateformat(new Date(element.created_at), "dddd, mmmm, dS, yyyy, h:MM:ss TT")}</small>
                </div>
              </div>
            </div>)}
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps() {

  let data = []
  let error = null

  try {
    // use NEXT_PUBLIC_ prefix for browser side loading
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaigns`)
    data = await response.json()
  } catch (err) {
    console.log('err :>> ', err)
    error = err.message ? err.message : "Something went wrong"
  }

  return {
    props: {
      data,
      error,
    }
  }
}
