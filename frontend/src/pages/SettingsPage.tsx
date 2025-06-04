import { useApp } from '../context/AppContext';

export default function SettingsPage() {
  const { state, updateTheme, logout } = useApp();
  return (
    <div>
      <h2>Settings</h2>
      <label>
        Theme:
        <select value={state.theme} onChange={e => updateTheme(e.target.value as 'light' | 'dark')}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
