/* eslint-disable import/no-named-default */
import {
  default as NextImage,
  type ImageProps as NextImageProps,
} from "next/image";
import {
  type FC,
  type ReactEventHandler,
  useState,
  type CSSProperties,
} from "react";

interface ImageProps extends NextImageProps {
  rounded?: CSSProperties["borderRadius"];
}

const ImageWithFallback: FC<ImageProps> = (props) => {
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
