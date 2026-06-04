type SubmitButtonProps = {
  isLoading: boolean;
};

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <button
      className="w-full rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-600 disabled:opacity-70"
      disabled={isLoading}
      type="submit"
    >
      {isLoading ? "Creating Listing..." : "Create Listing"}
    </button>
  );
}
