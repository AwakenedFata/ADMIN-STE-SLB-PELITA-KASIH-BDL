import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            const allowedEmail = process.env.ADMIN_EMAIL;
            if (user.email === allowedEmail) {
                return true;
            }
            console.log(`Blocked sign-in attempt from: ${user.email}`);
            return false; // Block Access
        },
    },
    pages: {
        signIn: '/login',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
