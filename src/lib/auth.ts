import { auth } from "@/auth";

export interface SessionPayload {
    userId: string;
    email?: string;
    phone?: string;
    name: string;
    role: string;
}

export async function getSession(): Promise<SessionPayload | null> {
    const session = await auth();

    if (!session?.user) return null;

    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userId: (session.user as any).id,
        email: session.user.email || undefined,
        name: session.user.name || "User",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: (session.user as any).role || "user",
    };
}

// Re-exporting common helpers but they are now powered by Next-Auth sessions
export async function clearSession(): Promise<void> {
    // Note: signOut() should be called from client-side or specific server actions
    // For manual cookie clearing if needed:
    // const { signOut } = await import("@/auth");
    // await signOut();
}
