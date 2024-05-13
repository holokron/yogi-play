import { ref, set, onValue } from "firebase/database";
import "firebase/auth";
import User from "@/types/User";
import { database as db } from "@/lib/app";

const database = {
  getSoundsRef: () => ref(db, "/sounds"),
  getTagsRef: () => ref(db, "/tags"),
  getUser: (id: string) =>
    onValue(ref(db, `/users/${id}`), (snapshot) => snapshot.val() as User),
  createUser: (user: User) => set(ref(db, `/users/${user.id}`), user),
};

export default database;
