# Tech SG

Tech SG is a vanilla HTML/CSS/JavaScript authentication and task-dashboard experience for TechSG Studio. The protected dashboard is served from the app's `dashboard/` path, whether the app is hosted at the domain root or under a subpath.

## How the three Day 4 tasks were combined

- Theme Switching is shared across login and dashboard through `shared/theme.js` and the existing Tech SG indigo/slate tokens.
- Login provides the client-side demo authentication, session guard, Remember Me, lockout, and accessibility states.
- To-Do is integrated into the protected dashboard with Overview, My Tasks, Completed, and Archived sections.

## Dashboard features

- Responsive sidebar, tablet rail, and mobile bottom navigation
- Hash navigation for Overview, My Tasks, Completed, and Archived
- Add, edit, complete, incomplete, archive, restore, and delete tasks
- Task notes, local date/time deadlines, deadline status chips, upcoming deadlines, search, and sorting
- Undo toasts for complete and archive actions
- Migration from `ledger_tasks_v1` to `tsg_tasks_v1`
- Shared light/dark theme and protected session routing
- Notification bell UI placeholder

## Notifications

Deadline notification functionality is intentionally UI-only for now. The app does not request browser notification permission, run reminder timers, send push notifications, or use a backend. Notification integration can be added later without changing the task model.

## Test credentials

- Email/username: `intern@techsgstudio.com`
- Password: `TSG@2026`

## Security note

Credentials are client-side for demo purposes only. Production would use a server-side authentication API with hashed passwords and tokens. Never store the password anywhere. This demo stores only the remembered email, session, and task data in browser storage.

## Deployment

Netlify publishes the repository root with no build command and no publish directory. Relative paths work both from the repository root and when the files are opened locally. Unknown URLs should use `404.html`.
