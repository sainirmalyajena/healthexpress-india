'use client';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="p-10 bg-red-50 text-red-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Something went wrong!</h1>
      <pre className="bg-white p-4 border border-red-200 overflow-auto whitespace-pre-wrap">{error.message}</pre>
      <pre className="bg-white p-4 border border-red-200 mt-4 overflow-auto whitespace-pre-wrap text-xs">{error.stack}</pre>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">Try again</button>
    </div>
  );
}
