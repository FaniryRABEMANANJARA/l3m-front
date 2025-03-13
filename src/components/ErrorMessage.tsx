'use client';

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="alert alert-danger mt-3">{message}</div>
);
export default ErrorMessage;