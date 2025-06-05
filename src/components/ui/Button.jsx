export default function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 ${className}`}
    >
      {children}
    </button>
  );
}
