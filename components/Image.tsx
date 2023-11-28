import { type ImageProps } from "next/image";
import { type FC } from "react";

const Image: FC<ImageProps> = (props) => {
  const { unoptimized = true, alt = "image", ...rest } = props;
  return <Image unoptimized={unoptimized} alt={alt} {...rest} />;
};

export default Image;
