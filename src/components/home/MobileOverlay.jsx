export function MobileOverlay({ visible, onClose }) {
  if (!visible) return null;

  return (
    <button
      type="button"
      className="home-sidebar-overlay"
      aria-label="Fechar menu"
      onClick={onClose}
    />
  );
}
