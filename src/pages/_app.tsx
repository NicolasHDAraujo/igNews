import { AppProps } from 'next/app';//tipando os componentes
import { Header } from '../components/Header';
import { SessionProvider } from 'next-auth/react';

import '../styles/global.scss';

function MyApp({
  Component,
  pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp

//se eu quiser que algo repita em todas as paginas, eu coloco nesta pagina
