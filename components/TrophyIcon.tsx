import { trophyColors } from "@/constants/trophy";
import { type TrophyType } from "@/models/TrophyModel";
import { type FC } from "react";
import { IconTrophy, type TablerIconsProps } from "@tabler/icons-react";

interface TrophyIconProps extends TablerIconsProps {
  type: TrophyType | string;
}

const TrophyIcon: FC<TrophyIconProps> = (props) => {
  const { type, ...rest } = props;
  return <IconTrophy color={trophyColors[type]} {...rest} />;
};

export default TrophyIcon;
