// Brand mark + wordmark. Accent-coloured key word. Used for navbar/footer; favicon is app/icon.svg (no icon.tsx).
export function Logo({ size = 28, word = true }: { size?: number; word?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-semibold" aria-label="ResumeVault">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#1d4ed8"/>
        <path d="M16 5 7 8.5V16c0 6 4 10 9 13 5-3 9-7 9-13V8.5L16 5Z" fill="#3b82f6"/><path d="M12 11h6a3 3 0 0 1 0 6h-2l4 5h-3l-4-5v5h-1V11Z" fill="#fff"/>
      </svg>
      {word && <span>Resume<span style={{ color: "#3b82f6" }}>Vault</span></span>}
    </span>
  );
}
export default Logo;
