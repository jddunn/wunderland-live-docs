import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function NotFound(): JSX.Element {
  return (
    <Layout title="Page Not Found">
      <div
        style={{
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '4rem', fontWeight: 800 }}>404</h1>
        <p
          style={{
            fontSize: '1.25rem',
            maxWidth: 500,
            margin: '1rem auto 2rem',
          }}
        >
          This page does not exist. It may have been moved or the URL might be
          incorrect.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link to="/" className="button button--primary button--lg">
            Documentation Home
          </Link>
          <Link
            to="/getting-started/quickstart"
            className="button button--secondary button--lg"
          >
            Getting Started
          </Link>
        </div>
      </div>
    </Layout>
  );
}
