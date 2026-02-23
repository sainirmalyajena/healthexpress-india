import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            id: "admin-login",
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = (credentials.email as string).toLowerCase().trim();
                const password = (credentials.password as string).trim();

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.passwordHash) {
                    console.warn(`Auth Failed: User not found or no password hash for ${email}`);
                    return null;
                }

                const isValid = await bcrypt.compare(
                    password,
                    user.passwordHash
                );

                if (!isValid) {
                    console.warn(`Auth Failed: Invalid password for ${email}`);
                    return null;
                }

                console.info(`Auth Success: Admin ${email} logged in`);

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
        Credentials({
            id: "doctor-login",
            name: "Doctor Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = (credentials.email as string).toLowerCase().trim();
                const password = (credentials.password as string).trim();

                const doctor = await prisma.doctor.findUnique({
                    where: { email },
                });

                if (!doctor || !doctor.passwordHash) {
                    console.warn(`Auth Failed: Doctor not found or no password hash for ${email}`);
                    return null;
                }

                const isValid = await bcrypt.compare(
                    password,
                    doctor.passwordHash
                );

                if (!isValid) {
                    console.warn(`Auth Failed: Invalid password for doctor ${email}`);
                    return null;
                }

                console.info(`Auth Success: Doctor ${email} logged in`);

                return {
                    id: doctor.id,
                    email: doctor.email,
                    name: doctor.name,
                    role: "doctor",
                };
            },
        }),
        Credentials({
            id: "partner-login",
            name: "Partner Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = (credentials.email as string).toLowerCase().trim();
                const password = (credentials.password as string).trim();

                const hospital = await prisma.hospital.findUnique({
                    where: { email },
                });

                if (!hospital || !hospital.passwordHash) {
                    console.warn(`Auth Failed: Hospital not found or no password hash for ${email}`);
                    return null;
                }

                const isValid = await bcrypt.compare(
                    password,
                    hospital.passwordHash
                );

                if (!isValid) {
                    console.warn(`Auth Failed: Invalid password for hospital ${email}`);
                    return null;
                }

                console.info(`Auth Success: Hospital ${email} logged in`);

                return {
                    id: hospital.id,
                    email: hospital.email,
                    name: hospital.name,
                    role: "partner",
                };
            },
        }),
        Credentials({
            id: "patient-login",
            name: "Patient Login",
            credentials: {
                phone: { label: "Phone", type: "text" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.otp) return null;

                // Verify OTP logic
                const lead = await prisma.lead.findFirst({
                    where: {
                        phone: credentials.phone as string,
                        otp: credentials.otp as string,
                        otpExpires: { gt: new Date() }
                    },
                });

                if (!lead) return null;

                return {
                    id: lead.id,
                    phone: lead.phone,
                    name: lead.fullName,
                    role: "patient",
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});
