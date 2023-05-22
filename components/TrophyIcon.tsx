import { trophyColors } from "@/constants/trophy";
import { type TrophyType } from "@/models/TrophyModel";
import { type FC } from "react";
import { Trophy, type IconProps } from "tabler-icons-react";

interface ITrophyIconProps extends IconProps {
  type: TrophyType | string;
}

const TrophyIcon: FC<ITrophyIconProps> = (props) => {
  const { type, ...rest } = props;
  return <Trophy color={trophyColors[type]} {...rest} />;
};

export default TrophyIcon;
