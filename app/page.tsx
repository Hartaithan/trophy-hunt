import { Title } from "@mantine/core";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { type NextPage } from "next";
import { cookies } from "next/headers";

const Home: NextPage = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data } = await supabase.auth.getSession();

  return (
    <main>
      <Title>Hello World!</Title>
      <pre style={{ maxWidth: 400, overflow: "auto", fontSize: 8 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
};

export default Home;
