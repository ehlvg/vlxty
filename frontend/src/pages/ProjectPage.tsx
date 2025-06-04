import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProjectPage() {
  const { teamId, projectId } = useParams();
  const { state, addTask } = useApp();
  const team = state.teams.find(t => t.id === teamId);
  const project = team?.projects.find(p => p.id === projectId);
  const [taskName, setTaskName] = useState('');
  if (!team || !project) return <div>Not found</div>;
  const statuses = project.statuses;
  const grouped: Record<string, any[]> = {};
  statuses.forEach(s => grouped[s.id] = []);
  project.tasks.forEach(t => grouped[t.statusId].push(t));
  return (
    <div>
      <h2>{project.name}</h2>
      <input placeholder="New task" value={taskName} onChange={e => setTaskName(e.target.value)} />
      <button onClick={() => { addTask(team.id, project.id, { name: taskName, statusId: statuses[0].id }); setTaskName(''); }}>Add</button>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {statuses.map(status => (
          <div key={status.id} style={{ border: '1px solid #ccc', padding: '0.5rem', width: '200px' }}>
            <h4>{status.name}</h4>
            {grouped[status.id].map(task => (
              <div key={task.id} style={{ background: '#f5f5f5', margin: '0.25rem', padding: '0.25rem' }}>{task.name}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
