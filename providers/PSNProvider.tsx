import API from "@/api/API";
import { type NullableProfile, type Profile } from "@/models/AuthModel";
import {
  type FC,
  type PropsWithChildren,
  createContext,
  useState,
  useContext,
} from "react";

interface IPSNProvider extends PropsWithChildren {
  initialProfile: NullableProfile;
}

interface IPSNContext {
  profile: Profile | null;
  updateProfile: () => void;
}

const initialContextValue: IPSNContext = {
  profile: null,
  updateProfile: () => null,
};

const Context = createContext(initialContextValue);

const PSNProvider: FC<IPSNProvider> = (props) => {
  const { children, initialProfile } = props;
  const [profile, setProfile] = useState<NullableProfile>(
    initialProfile ?? null
  );

  const updateProfile = (): void => {
    API.get("/profile")
      .then(({ data }) => {
        const profile = data.profile;
        setProfile(profile);
      })
      .catch((error) => {
        console.error("unable to fetch profile", error);
      });
  };

  const exposed: IPSNContext = {
    profile,
    updateProfile,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useProfile = (): IPSNContext => useContext(Context);

export default PSNProvider;
