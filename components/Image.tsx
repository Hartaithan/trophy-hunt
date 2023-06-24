/* eslint-disable import/no-named-default */
import { default as NextImage, type ImageProps } from "next/image";
import { type FC, type ReactEventHandler, useState } from "react";

const ImageWithFallback: FC<ImageProps> = (props) => {
  const { onError, alt, ...rest } = props;

  const [error, setError] = useState<boolean>(false);

  const handleError: ReactEventHandler<HTMLImageElement> = (e) => {
    setError(true);
    if (onError != null) {
      onError(e);
    }
  };

  return (
    <NextImage onError={handleError} unoptimized={error} alt={alt} {...rest} />
  );
};

export default ImageWithFallback;
