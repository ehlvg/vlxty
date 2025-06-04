import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function TeamsPage() {
  const { state, createTeam, createProject } = useApp();
  const [teamName, setTeamName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [query, setQuery] = useState('');
  const results = query
    ? state.teams.flatMap(team =>
        team.projects.flatMap(p =>
          p.tasks.filter(t => t.name.toLowerCase().includes(query.toLowerCase())).map(t => ({ team, project: p, task: t }))
        )
      )
    : [];
  return (
    <div>
      <h2>Your Teams</h2>
      <input placeholder="New team name" value={teamName} onChange={e => setTeamName(e.target.value)} />
      <button onClick={() => { createTeam(teamName); setTeamName(''); }}>Create Team</button>
      <div>
        <input placeholder="Search tasks" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      {query && results.map(r => (
        <div key={r.task.id}>
          <Link to={`/team/${r.team.id}/project/${r.project.id}`}>{r.project.name}</Link>: {r.task.name}
        </div>
      ))}
      {state.teams.map(team => (
        <div key={team.id}>
          <h3>{team.name}</h3>
          <input placeholder="Project name" value={projectName} onChange={e => setProjectName(e.target.value)} />
          <button onClick={() => { createProject(team.id, projectName); setProjectName(''); }}>Add Project</button>
          {team.projects.map(p => (
            <div key={p.id}>
              <Link to={`/team/${team.id}/project/${p.id}`}>{p.name}</Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
