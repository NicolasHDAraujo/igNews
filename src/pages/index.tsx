import { GetStaticProps } from 'next'; //tipagem
import Head from 'next/head';
import Image from 'next/image';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({product}: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏Hey, welcome</span>
          <h1>News about <br />the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br/>
            <span>for {product.amount} month.</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image
          src="/images/avatar.svg"
          alt="Girl coding"
          width="336"
          height="521"
        />
      </main>
    </>
  )
}
//sempre tem que ser de uma página para os componentes
//pegar os dados e salvar de forma estática, atualizando conforme um determinado tempo Static Site Generation
//uilizado apenas em páginas que os dados são os mesmos para todos os usuários
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1K6oOrFNrOIIdvjZgLYcBJNj', {
    expand: ['product'] //todas as informações do produto
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}




/*esta chamada é para se renderizar os dados como Server Side Rendering (Na camada do Next, não do Node)
export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1K6oOrFNrOIIdvjZgLYcBJNj', {
    expand: ['product'] //todas as informações do produto
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product
    }
  }
}*/
