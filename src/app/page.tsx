import { LoginPage } from "@/components/login-page";
import { SignOut } from "@/components/signout-button";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  console.log('session', session);
  return (
    <main className="pt-32">
      {session ? <>
        <SignOut />
      </> : <LoginPage />}
    </main>
  );
}
