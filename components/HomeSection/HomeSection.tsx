import { type Session } from "@supabase/supabase-js";
import { type FC } from "react";

interface Props {
  session: Session;
}

const HomeSection: FC<Props> = (props) => {
  const { session } = props;
  return (
    <pre style={{ maxWidth: 400, overflow: "auto", fontSize: 8 }}>
      there should be profile stats, last 5 games and etc
      <br />
      <br />
      {JSON.stringify(session, null, 2)}
    </pre>
  );
};

export default HomeSection;
