import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/react';

import styles from './styles.module.scss';

export function SingInButton() {
  const { data: session } = useSession();

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
      >
      <FaGithub color="#04b361" />
      {session.user.name}
      <FiX color="#737380" />
    </button>
  ) : (
    <button
    type="button"
    className={styles.signInButton}
    onClick={() => signIn('github')}
    >
    <FaGithub color="#eba417" />
    Sign in with GitHub
  </button>
  )
}