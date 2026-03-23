import { auth } from "@/auth";

export async function getDoctorSession() {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || (session.user as any).role !== 'doctor') return null;

    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        doctorId: (session.user as any).id,
        email: session.user.email || '',
        name: session.user.name || '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hospitalId: (session.user as any).hospitalId || '',
    };
}
