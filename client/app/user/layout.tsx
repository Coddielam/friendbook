import Link from "next/link";
import UserProfile from "./UserProfile";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center w-full pt-16">
      <nav className="bg-blue py-3 w-full text-center fixed top-0 z-50">
        <div className="w-full flex items-center justify-between px-8">
          <Link href="/">
            <h1 className="text-white">friendbook</h1>
          </Link>
          <UserProfile />
        </div>
      </nav>
      <div className="w-full pb-12 px-6 md:px-8 h-full pt-7">{children}</div>
    </div>
  );
}
