import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";
import EmailProvider from "next-auth/providers/email";
import InstagramProvider from "next-auth/providers/instagram";
import TikTokProvider from "@lib/providers/tiktok-provider";
import { prisma } from "@lib/db";
import { sendVerificationRequest } from "./email";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  debug: true, // Activer le mode debug pour voir les logs
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
    
        // TODO: remplace par ton backend JWT plus tard
        if (credentials.email === "admin@naim.com" && credentials.password === "7654321") {
          return { id: "admin", email: credentials.email, name: "Admin" };
        }
        // minimal pour dev :
        return { id: "user-"+Date.now(), email: credentials.email, name: "User" };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds guilds.members.read",
        }
      }
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
    TikTokProvider({
      clientId: process.env.TIKTOK_CLIENT_ID!,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    }),
    EmailProvider({
      from: process.env.EMAIL_FROM || "noreply@artgold.com",
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("SignIn callback - User:", user);
        console.log("SignIn callback - Account:", account);
        
        if (!user.email) {
          console.error("No email provided for user:", user);
          return false;
        }

        // Vérifions si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            email: true,
            status: true
          }
        });

        console.log("Existing user:", existingUser);

        // Si l'utilisateur n'existe pas, on laisse NextAuth le créer
        if (!existingUser) {
          console.log("New user - allowing creation");
          return true;
        }

        // Si l'utilisateur existe et est banni ou gelé, on refuse la connexion
        if (existingUser.status === "BANNED" || existingUser.status === "FROZEN") {
          console.error("User account is banned or frozen:", user.email);
          return false;
        }

        console.log("User allowed to sign in");
        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      console.log("JWT callback - Token:", token);
      console.log("JWT callback - User:", user);
      console.log("JWT callback - Account:", account);

      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - Session:", session);
      console.log("Session callback - Token:", token);

      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - URL:", url);
      console.log("Redirect callback - Base URL:", baseUrl);

      // Rediriger vers le dashboard avec la langue par défaut
      if (url.startsWith(baseUrl) || url.startsWith('/')) {
        const redirectUrl = `${baseUrl}/fr/dashboard`;
        console.log("Redirecting to:", redirectUrl);
        return redirectUrl;
      }

      console.log("Fallback redirect to baseUrl");
      return baseUrl;
    }
  },
  events: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) return;

        await prisma.user.update({
          where: { email: user.email },
          data: {
            updatedAt: new Date(),
            status: "ACTIVE"
          }
        });

        if (account?.provider === 'discord' && profile) {
          const discordProfile = profile as { guilds?: { roles?: string[] }[] };
          const discordRoles = discordProfile.guilds?.[0]?.roles || [];
          
          await prisma.user.update({
            where: { email: user.email },
            data: {
              discordRoles,
              discordVerified: true,
            }
          });
        }
      } catch (error) {
        console.error("Sign in event error:", error);
      }
    },
    async createUser({ user }) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            status: "ACTIVE",
            balance: 0,
            artworkCount: 0,
            isAdmin: false,
            discordVerified: false,
            discordRoles: [],
          }
        });
      } catch (error) {
        console.error("Create user event error:", error);
      }
    }
  }
};