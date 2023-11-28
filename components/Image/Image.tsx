"use client";

import { type FC } from "react";
import NextImage, { type ImageProps } from "next/image";

const Image: FC<ImageProps> = (props) => {
  const { unoptimized = true, ...rest } = props;
  return <NextImage unoptimized={unoptimized} {...rest} />;
};

export default Image;
