import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { state } = useApp();
  if (!state.currentUser) return null;
  return (
    <header>
      <nav>
        <Link to="/">Teams</Link> |{' '}
        <Link to="/settings">Settings</Link>
      </nav>
    </header>
  );
}
