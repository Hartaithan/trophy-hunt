"use client";

// eslint-disable-next-line no-restricted-imports
import NextLink, { type LinkProps } from "next/link";
import { type FC, type PropsWithChildren } from "react";

type Props = LinkProps & PropsWithChildren;

const Link: FC<Props> = (props) => {
  const { prefetch = false, ...rest } = props;
  return <NextLink prefetch={prefetch} {...rest} />;
};

export default Link;
