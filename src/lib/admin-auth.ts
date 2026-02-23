import { auth } from "@/auth";

export async function getAdminSession() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'admin') return null;

    return {
        adminId: (session.user as any).id,
        email: session.user.email || '',
        name: session.user.name || 'Admin',
        role: (session.user as any).role
    };
}
