import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "~/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any, // Type assertion to fix compatibility
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds guilds.members.read",
        }
      },
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.fontColor = user.fontColor;
        token.fontFamily = user.fontFamily;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.fontColor = token.fontColor as string | null;
        session.user.fontFamily = token.fontFamily as string | null;
      }
      return session;
    }
  },
  events: {
    async signIn({ user, account, profile }) {
      if (!user.id) return;

      if (account?.provider === 'google') {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: profile?.name,
            email: profile?.email,
            image: profile?.image,
            emailVerified: new Date()
          }
        });
      } else if (account?.provider === 'discord') {
        const discordUser = await fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${account.access_token}`
          }
        }).then(res => res.json());

        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: discordUser.username,
            discordVerified: true,
            discordRoles: discordUser.roles || []
          }
        });
      }
    },
  },
};
