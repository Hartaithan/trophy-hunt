/* eslint-disable import/no-named-default */
import { default as NextImage, type ImageProps } from "next/image";
import {
  type FC,
  type ReactEventHandler,
  useState,
  type CSSProperties,
} from "react";

interface IImageProps extends ImageProps {
  rounded?: CSSProperties["borderRadius"];
}

const ImageWithFallback: FC<IImageProps> = (props) => {
  const { onError, alt, rounded, ...rest } = props;

  const [error, setError] = useState<boolean>(false);

  const handleError: ReactEventHandler<HTMLImageElement> = (e) => {
    setError(true);
    if (onError != null) {
      onError(e);
    }
  };

  return (
    <NextImage
      onError={handleError}
      unoptimized={error}
      alt={alt}
      {...rest}
      style={{ ...rest.style, borderRadius: rounded }}
    />
  );
};

export default ImageWithFallback;
