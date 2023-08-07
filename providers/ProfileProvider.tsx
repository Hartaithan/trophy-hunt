import API from "@/helpers/api";
import {
  type NullableProfile,
  type NullablePSNProfile,
} from "@/models/AuthModel";
import { useUser } from "@supabase/auth-helpers-react";
import {
  type FC,
  type PropsWithChildren,
  createContext,
  useState,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

interface IProfileProvider extends PropsWithChildren {
  initialProfile: NullableProfile;
  initialPSNProfile: NullablePSNProfile;
}

interface IProfilesState {
  psn: NullablePSNProfile;
  profile: NullableProfile;
}

interface IProfileContext extends IProfilesState {
  isAuth: boolean;
  setProfile: Dispatch<SetStateAction<NullableProfile>>;
  updateProfile: () => void;
  updatePSNProfile: () => void;
}

const initialContextValue: IProfileContext = {
  psn: null,
  profile: null,
  isAuth: false,
  setProfile: () => null,
  updateProfile: () => null,
  updatePSNProfile: () => null,
};

const Context = createContext(initialContextValue);

const ProfileProvider: FC<IProfileProvider> = (props) => {
  const { children, initialProfile = null, initialPSNProfile = null } = props;
  const [profile, setProfile] = useState<NullableProfile>(initialProfile);
  const [psn, setPSN] = useState<NullablePSNProfile>(initialPSNProfile);
  const user = useUser();

  const updateProfile = (): void => {
    API.get("/profile")
      .then(({ data }) => {
        setProfile(data?.profile ?? null);
      })
      .catch((error) => {
        console.error("unable to fetch profile", error);
      });
  };

  const updatePSNProfile = (): void => {
    API.get("/profile/psn")
      .then(({ data }) => {
        setPSN(data?.profile ?? null);
      })
      .catch((error) => {
        console.error("unable to fetch psn profile", error);
      });
  };

  const exposed: IProfileContext = {
    psn,
    profile,
    isAuth: psn !== null && user !== null,
    setProfile,
    updateProfile,
    updatePSNProfile,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useProfiles = (): IProfileContext => useContext(Context);

export default ProfileProvider;
