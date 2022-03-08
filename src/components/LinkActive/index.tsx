import Link, { LinkProps } from "next/link";
import { cloneElement, ReactElement } from "react";
import { useRouter } from 'next/router';

interface LinkActiveProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function LinkActive({ children, activeClassName, ...rest }: LinkActiveProps) {
  const { asPath } = useRouter()

  const className = asPath === rest.href ? activeClassName : '';

  return (
    <Link {...rest}>
      {cloneElement(children, { //clonar um elemento e modificar coisas nele
        className,
      })}
    </Link>
  )
}
