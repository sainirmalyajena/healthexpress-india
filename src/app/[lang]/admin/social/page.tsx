import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, CheckCircle2, AlertCircle } from 'lucide-react';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export default async function SocialAdminPage() {
    // Check if token exists
    const tokenRecord = await prisma.systemSetting.findUnique({
        where: { key: 'META_PAGE_ACCESS_TOKEN' }
    });

    const isConnected = !!tokenRecord;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Social Media Autobot</h1>
            <p className="text-muted-foreground">
                Connect your Facebook and Instagram accounts to enable automated posting.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-blue-600" />
                            Meta Connection
                        </CardTitle>
                        <CardDescription>
                            Connect to your Meta App to generate the permanent Page Access Token.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isConnected ? (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-green-800">Connected</h3>
                                    <p className="text-sm text-green-700 mt-1">
                                        Your Meta account is connected and the Autobot has publishing permissions.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-amber-800">Not Connected</h3>
                                    <p className="text-sm text-amber-700 mt-1">
                                        You need to authorize the app to enable automated posting.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-slate-100">
                            <form action="/api/social/auth" method="GET">
                                <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                                    {isConnected ? 'Reconnect Facebook & Instagram' : 'Connect Facebook & Instagram'}
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
