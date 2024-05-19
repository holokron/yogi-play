import { AppThunkDispatch } from "@/store";
import { authenticate, loadSounds, loadTags } from "@/store/actions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useInitialize() {
  const dispatch = useDispatch<AppThunkDispatch>();

  useEffect(() => {
    dispatch(loadTags());
    dispatch(loadSounds());
    dispatch(authenticate());
  }, []);
}
