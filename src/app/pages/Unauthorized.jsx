import { Link } from 'react-router-dom';

export function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#F3F0FF]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
        <p className="text-xl text-gray-700 mb-6">Unauthorized access.</p>
        <Link to="/" className="btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
