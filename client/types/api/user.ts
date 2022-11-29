export type TUser = {
  company: string;
  createdAt: string;
  email: string;
  friends: Omit<TUser, "friends">[];
  id: string;
  name: string;
  phone: 12341234;
  profile_pic: string;
  updatedAt: string;
};
