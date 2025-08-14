import '../styles/globals.css'; // Make sure your global CSS is imported
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    // This div wraps all your pages and applies the consistent background
    <SessionProvider session={session}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 font-sans text-gray-100">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

export default MyApp;