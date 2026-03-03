import './components.css';

const Header = ({ isRunning, sessionTime }) => {
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <header className="header">
      <div className="header__logo">
        <span className="header__logo--park">PARK</span>
        <span className="header__logo--it">IT</span>
      </div>

      <div className="header__right">
        <span className="header__session-label">SESSION</span>
        <span className="header__timer">{formatTime(sessionTime)}</span>
        <span className={`header__live-dot ${isRunning ? 'header__live-dot--active' : ''}`} />
        <span className={`header__live-text ${isRunning ? 'header__live-text--active' : ''}`}>
          LIVE
        </span>
      </div>
    </header>
  );
};

export default Header;
