import { getSupabaseClient } from '@/lib/supabase'
import { connection } from 'next/server'

export const metadata = {
  title: 'The Daily Collection | Task Gallery',
  description: 'A considered collection of the things worth doing.',
}

export default async function TasksPage() {
  await connection()
  let tasks = []
  let errorMessage = ''

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, completed, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    tasks = data ?? []
  } catch (error) {
    errorMessage = error instanceof Error
      ? error.message
      : 'The collection could not be loaded. Please try again later.'
  }

  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <main className="museum-page">
      <header className="museum-header">
        <a className="wordmark" href="/" aria-label="The Daily Collection home">
          <span className="wordmark-seal" aria-hidden="true">D</span>
          <span>THE DAILY COLLECTION</span>
        </a>
        <div className="header-note"><span className="live-dot" /> A PERSONAL ARCHIVE <span className="header-divider">/</span> EST. MMXXIV</div>
      </header>

      <section className="gallery-intro" aria-labelledby="gallery-title">
        <div className="eyebrow"><span>ROOM 01</span><span className="eyebrow-line" /><span>ON VIEW TODAY</span></div>
        <p className="intro-kicker">A small practice in paying attention.</p>
        <h1 id="gallery-title">The things<br /><em>worth doing.</em></h1>
        <div className="intro-bottom">
          <p>A living collection of intentions, in progress and complete.<br className="desktop-break" /> Each one a small work in the making.</p>
          <div className="collection-count"><span className="count-number">{String(tasks.length).padStart(2, '0')}</span><span>OBJECTS<br />IN COLLECTION</span></div>
        </div>
      </section>

      <section className="collection-section" aria-label="Task collection">
        <div className="section-heading">
          <div><span className="section-index">01</span><h2>Current collection</h2></div>
          <span className="collection-progress">{completedCount} OF {tasks.length} COMPLETED</span>
        </div>

        {errorMessage ? (
          <div className="notice-card" role="alert">
            <span className="notice-mark" aria-hidden="true">!</span>
            <div><h3>The gallery is temporarily closed.</h3><p>{errorMessage}</p></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state"><span className="empty-star" aria-hidden="true">✳</span><div><h3>A little room for something new.</h3><p>There are no tasks in the collection yet.</p></div></div>
        ) : (
          <ol className="task-grid">
            {tasks.map((task, index) => (
              <li className={`task-card${task.completed ? ' is-complete' : ''}`} key={task.id}>
                <div className="card-topline"><span>PLATE {String(index + 1).padStart(2, '0')}</span><span>{task.completed ? 'ACCOMPLISHED' : 'IN PROGRESS'}</span></div>
                <div className="artwork" aria-hidden="true"><span className={`artwork-shape shape-${index % 4}`}><span /></span><span className="artwork-caption">FIG. {String(index + 1).padStart(2, '0')}</span></div>
                <div className="card-details">
                  <div><span className="object-label">DAILY STUDY</span><h3>{task.title}</h3></div>
                  <span className={`task-status${task.completed ? ' status-complete' : ''}`} aria-label={task.completed ? 'Completed' : 'In progress'}>{task.completed ? '✓' : '⌛'}</span>
                </div>
                <div className="card-footer"><span>THE PRACTICE OF BEGINNING</span><time dateTime={task.created_at}>{new Date(task.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}</time></div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <footer className="museum-footer"><span>TAKE YOUR TIME.</span><span className="footer-ornament" aria-hidden="true">✳</span><span>RETURN OFTEN.</span></footer>
    </main>
  )
}
