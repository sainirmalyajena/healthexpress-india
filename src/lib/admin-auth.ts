import { auth } from "@/auth";

export async function getAdminSession() {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || (session.user as any).role !== 'admin') return null;

    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        adminId: (session.user as any).id,
        email: session.user.email || '',
        name: session.user.name || 'Admin',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: (session.user as any).role
    };
}
