import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    authorized: async ({ auth, request }) => {
      console.log('authorized', auth)
      if (request.url.match(/\/dashboard\/*/)) {
        return !!auth
      }
      return true;
    },
    jwt: async ({ token, user, account, profile, session, trigger }) => {
      if (trigger === "signIn") {
        console.log('provider', account?.provider)
        console.log('username', profile?.login)
        console.log('name', profile?.name)
        console.log('email', profile?.email)
        console.log('avatar', profile?.avatar_url)
        console.log('profile', profile)
      }
      return token
    },
    session: async ({ session, token, newSession, user, trigger }) => {
      return session
    },
  },
})
