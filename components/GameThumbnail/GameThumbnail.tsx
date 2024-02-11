import { Fragment, type FC } from "react";
import { Box, Overlay } from "@mantine/core";
import classes from "./GameThumbnail.module.css";
import Image from "../Image/Image";
import { type ImageProps } from "next/image";
import clsx from "clsx";

interface Props {
  className?: string;
  url: string | undefined;
  overlay?: boolean;
  imageProps?: ImageProps;
}

const GameThumbnail: FC<Props> = (props) => {
  const { className, url = "", overlay = false, imageProps = {} } = props;

  return (
    <Box className={clsx(classes.wrapper, className)}>
      <Image
        className={classes.image}
        src={url}
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt="image card"
        {...imageProps}
      />
      {overlay && (
        <Fragment>
          <Overlay
            zIndex={2}
            gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))"
          />
          <Image
            className={classes.background}
            src={url}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="image card"
            {...imageProps}
          />
        </Fragment>
      )}
    </Box>
  );
};

export default GameThumbnail;
