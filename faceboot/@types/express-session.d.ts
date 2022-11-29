import "express-session";

declare module "express-session" {
  interface SessionData {
    email: string;
    userId: string;
    profile_pic: string;
    friendRequests: { id: string; userId: string; befriendId: string }[];
  }
}
