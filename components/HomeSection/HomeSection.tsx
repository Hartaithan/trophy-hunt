import { type Game } from "@/models/GameModel";
import { type Session } from "@supabase/supabase-js";
import { type FC } from "react";

interface Props {
  games: Game[];
  session: Session;
}

const HomeSection: FC<Props> = (props) => {
  const { games, session } = props;
  return (
    <div style={{ display: "flex" }}>
      <pre
        style={{
          flex: 1,
          overflow: "auto",
          fontSize: 8,
          whiteSpace: "pre-wrap",
        }}>
        {JSON.stringify(games, null, 2)}
      </pre>
      <pre
        style={{
          flex: 1,
          overflow: "auto",
          fontSize: 8,
          whiteSpace: "pre-wrap",
        }}>
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
};

export default HomeSection;
