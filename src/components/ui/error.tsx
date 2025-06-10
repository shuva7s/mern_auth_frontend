const ErrorBox = ({ error }: { error: string }) => {
  return (
    <div className="px-3 py-2 rounded-sm bg-destructive/10 text-destructive text-sm">
      <p>{error}</p>
    </div>
  );
};

export default ErrorBox;
