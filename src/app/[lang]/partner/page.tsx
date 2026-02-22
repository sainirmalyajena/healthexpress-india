import { redirect } from 'next/navigation';

export default async function PartnerRootPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    redirect(`/${lang}/partner/dashboard`);
}
