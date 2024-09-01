import mongo from "@/src/services/mongoDb/config.mongoDb.mjs";
import User from "@/src/models/auth.model.js";
import Log from "@/src/models/usersLog.model.js";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bycrptjs from "bcryptjs";

export const options = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        let { email, password, validado, ip, agent } = credentials;
        try {
          email = email.toLowerCase();
          await mongo();
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }
          if (validado) {
            return user;
          }
          const passwordsMatch = await bycrptjs.compare(
            password,
            user.password
          );
          if (!passwordsMatch) {
            return null;
          }
          user.ip = ip;
          user.agent = agent;
          return user;
        } catch (error) {
          console.log("Error:", error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,   
    }),
  ],
  session: {
    jwt: true,
    maxAge: 60 * 60 * 24 * 30// 60 days
  },
  callbacks: {
    async session(session, token) {
      if (token) {
        await mongo();
        const user = await User.findOne({ email: token.user.email });
        if (user) {
          session.user = user.toObject();
          delete session.user.password; 
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      const { ip, agent } = user;
      if (account.provider === "google") {
        try {
          if (!profile.email) {
            return null;
          }
          await mongo();
          let { email } = profile;
          email = email.toLowerCase();
          user = await User.findOne({ email });
          if (!user) {
            user = new User({
              email: email,
              nombre: profile.given_name,
              apellido: profile.family_name ? profile.family_name : profile.name,
              picture: profile.picture ? profile.picture : '',
              incompleto: true, 
            });        
            await user.save();
          } else {
            if (user.picture !== profile.picture) {
              user.picture = profile.picture;
              await user.save();
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
      const log = new Log({
        email: user.email,
        perfil: user.perfil,
        provider: account.provider,
        ip: user.ip,
        agent: user.agent,
        tipo: 1,
        user: user._id,
      });      
      await log.save();
      user.logs.push(log._id);
      await user.save();
      return user;
    },   
    async jwt({ token, user }) {
      if (user) {
        await mongo();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.user = dbUser.toObject();
          delete token.user.password;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = token.user;
        delete session.user.password;
      }
      return session;
    },
  },
  events: {
    async createUser(message) {
    },
    async signIn(message) {
      
    },
    async signOut({ token }) {   
      if (token) {
        const user = token.user;

        await mongo();
        const bdUser = await User.findOne({ _id: user._id });
        const log = new Log({
          email: bdUser.email,
          perfil: bdUser.perfil,
          provider: '',
          ip: '',
          agent: '',
          tipo: 2,
          user: user._id,
        });
        await log.save();
        bdUser.logs.push(log._id);
        await bdUser.save();       
      }
    },
    async linkAccount(message) {
      
    },
    async session(message) {
     
    },
    async error(message) {
      console.log("error", message);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
    signOut: '/',
  },
  
};
