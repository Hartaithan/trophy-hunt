import { Fragment, type FC } from "react";
import LandingSlogan from "../LandingSlogan/LandingSlogan";
import LandingFeatures from "../LandingFeatures/LandingFeatures";
import LandingFAQ from "../LandingFAQ/LandingFAQ";

const Landing: FC = () => {
  return (
    <Fragment>
      <LandingSlogan />
      <LandingFeatures />
      <LandingFAQ />
    </Fragment>
  );
};

export default Landing;
