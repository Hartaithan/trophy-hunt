import { type PropsWithChildren, type FC } from "react";
import NextLink, { type LinkProps } from "next/link";

type Props = LinkProps & PropsWithChildren;

const Link: FC<Props> = (props) => {
  const { prefetch = false, ...rest } = props;
  return <NextLink prefetch={prefetch} {...rest} />;
};

export default Link;
