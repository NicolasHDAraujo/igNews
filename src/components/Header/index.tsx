import Image from 'next/image';
import { LinkActive } from '../LinkActive';
import { SingInButton } from '../SignInButton';

import styles from './styles.module.scss';

export function Header() {


  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image
          src="/images/logo.svg"
          alt="Logo Ignews"
          width="120"
          height="120"
        />
        <nav>
          <LinkActive
            activeClassName={styles.active}
            href="/"
          >
            <a>
              Home
            </a>
          </LinkActive>
          <LinkActive
            activeClassName={styles.active}
            href="/posts"
            prefetch
          >
            <a>
              Posts
            </a>
          </LinkActive>
        </nav>

        <SingInButton />
      </div>
    </header >
  )
}
