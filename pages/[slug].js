import React, { useState } from 'react'
import styles from '../styles/Detail.module.css'
import Image from 'next/image'
import Link from 'next/link'
import dateformat from "dateformat"
import Head from 'next/head'
import { FaCheckCircle } from "react-icons/fa"
import * as gtag from '../lib/gtag'


export default function Campaign({ data }) {

    const [submitted, setIsSubmitted] = useState(false)
    const [submitting, setIsSubmitting] = useState(false)
    const [email, setEmail] = useState("")

    const handleOnSubmit = (e) => {
        e.preventDefault()

        const options = {
            method: "POST",
            body: JSON.stringify({
                email,
                campaign: data.id,
            }),

            headers: {
                'Content-Type': 'application/json'
            }
        }

        setIsSubmitting(true)
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/subscribers`, options).
            then(res => res.json()).
            then(response => setIsSubmitted(true)).
            then(gtag.event({
                action: 'submit_form',
                category: 'Contact',
                label: email,})).
            catch(error => console.log('error', error)).
            finally(() => {
                setIsSubmitting(false)
            })
    }



    return (
        <div>
            <Head>
                <title>{data.title}</title>
                <meta name="description" content={data.description} />
            </Head>

            <div className={styles.wrapper}>
                <div className={styles.main}>

                </div>


                <div className={styles.contents}>
                    <Image
                        className={styles.img}
                        src={"https://res.cloudinary.com/dsodgvh31/" + data.logo}
                        height={100}
                        width={100}
                        alt="Campaign Logo"
                    />

                    <div className={styles.grid}>
                        <div className={styles.left}>
                            <h1 className={styles.title}>{data.title}</h1>
                            <p className={styles.description}>{data.description}</p>
                        </div>

                        <div className={styles.right}>
                            {!submitted ? <div className={styles.rightContents}>
                                <form onSubmit={handleOnSubmit}>
                                    <div className={styles.formGroup}>
                                        <input
                                            onChange={(event) => {
                                                setEmail(event.target.value)
                                            }}
                                            required
                                            type="email"
                                            name="email"
                                            placeholder="Enter an Email"
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.submit}>
                                        <input
                                            type="submit"
                                            name="email"
                                            value={submitting ? "PLEASE WAIT" : "SUBSCRIBE"}
                                            disabled={submitting}
                                            className={styles.button}
                                        />
                                        <p className={styles.consent}>We respect your privacy, Unsubscribe anytime!</p>
                                    </div>
                                </form>
                            </div> :
                                <div className={styles.thankyou}>
                                    <div className={styles.icon}>
                                        <FaCheckCircle size={17} color="green" />
                                    </div>

                                    <div className={styles.message}>
                                        Thank you for your subscribtion.
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.item}>
                <div className={styles.imgContainer}>
                </div>

                <div className={styles.rightItems}>

                    <small>{dateformat(new Date(data.created_at), "dddd, mmmm, dS, yyyy, h:MM:ss TT")}</small>
                </div>

                <footer className={styles.footer}>
                    <Link href="/">
                        <a>Go back to list</a>
                    </Link>
                </footer>
            </div>
        </div>
    )
}

export async function getStaticPaths() {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaigns`)
    const data = await response.json()

    const allSlugs = data.map(item => item.slug)

    const paths = allSlugs.map(slug => ({ params: { slug: slug } }))

    return {
        paths,
        fallback: false,
    }

    // return [{ params: { slug: slug } }, { params: { slug: slug } }]
}

export async function getStaticProps({ params }) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaigns/${params.slug}`)
    const data = await response.json()

    return {
        props: {
            data,
        }
    }
}