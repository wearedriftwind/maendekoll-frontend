import NextAuth from "next-auth";
import Slack from "next-auth/providers/slack";
import { apiClient } from "@/lib/apiClient";
import type { AdminUser } from "@/types/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Slack({
      clientId: process.env.AUTH_SLACK_ID,
      clientSecret: process.env.AUTH_SLACK_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ profile }) {
      const slackUserId = profile?.["https://slack.com/user_id"] as
        | string
        | undefined;
      if (!slackUserId) return false;

      const users = await apiClient.get<AdminUser[]>("/users");
      const match = users.find((user) => user.slack_user_id === slackUserId);

      return Boolean(match?.active && match.role === "admin");
    },
    async jwt({ token, profile }) {
      const slackUserId = profile?.["https://slack.com/user_id"] as
        | string
        | undefined;
      if (slackUserId) token.slackUserId = slackUserId;
      return token;
    },
    async session({ session, token }) {
      if (token.slackUserId) {
        session.user.slackUserId = token.slackUserId as string;
      }
      return session;
    },
  },
});
