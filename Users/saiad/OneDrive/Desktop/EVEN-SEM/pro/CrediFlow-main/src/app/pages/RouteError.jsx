import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

export function RouteError() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong';

  const description = isRouteErrorResponse(error)
    ? error.data?.message || 'The requested page could not be loaded.'
    : error?.message || 'An unexpected application error occurred.';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F0FF] px-6">
      <div className="w-full max-w-xl rounded-[2rem] border border-gray-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5B2DFF]">CrediFlow</p>
        <h1 className="mt-4 text-4xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-4 text-base text-gray-600">{description}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/" className="btn-primary">
            Home
          </Link>
          <Link to="/login" className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
