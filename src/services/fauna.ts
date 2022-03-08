import { Client } from 'faunadb'
//conectando ao banco do fauna
export const fauna = new Client({
  secret: process.env.FAUNA_KEY
})

/*******************************
 * Consultas no banco só podem ser feitas dentro dos metodos GetStaticProps, GetServerSideProps(SSR SSG) ou das api roots
 */
