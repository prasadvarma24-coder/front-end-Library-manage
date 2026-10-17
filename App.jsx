
import { useMemo, useState } from "react";
import "./App.css";

const permissionList = [
  { id: "dashboard", label: "View Dashboard", group: "General" },
  { id: "books", label: "Manage Books", group: "Library" },
  { id: "borrow", label: "Manage Borrowing", group: "Library" },
  { id: "members", label: "Manage Members", group: "Users" },
  { id: "reports", label: "View Reports", group: "Reports" },
  { id: "settings", label: "Manage Settings", group: "System" },
];

const initialRoles = [
  {
    id: 1,
    name: "Super Admin",
    color: "#7357ed",
    users: ["PrasadVarma"],
    permissions: permissionList.map(p => p.id),
  },
  {
    id: 2,
    name: "Librarian",
    color: "#0e9f86",
    users: ["Rahul"],
    permissions: ["dashboard", "books", "borrow", "members"],
  },
  {
    id: 3,
    name: "Teacher",
    color: "#e99a32",
    users: ["Diva"],
    permissions: ["dashboard", "books", "borrow"],
  },
  {
    id: 4,
    name: "Student",
    color: "#e15a79",
    users: ["Satya"],
    permissions: ["dashboard"],
  },
];

const initialUsers = [
  "Prasad Varma",
  "Rahul",
  "Satya",
  "Diva" 
];

export default function App() {
  const [roles, setRoles] = useState(initialRoles);
  const [users] = useState(initialUsers);
  const [selectedId, setSelectedId] = useState(1);
  const [roleName, setRoleName] = useState("");
  const [search, setSearch] = useState("");
  const [newUser, setNewUser] = useState("");
  const [dark, setDark] = useState(false);
  const [notice, setNotice] = useState("");

  const selectedRole = roles.find(r => r.id === selectedId);

  const filteredRoles = useMemo(
    () => roles.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase())
    ),
    [roles, search]
  );

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function addRole(e) {
    e.preventDefault();
    const name = roleName.trim();

    if (!name) return notify("Enter a role name.");
    if (roles.some(r => r.name.toLowerCase() === name.toLowerCase())) {
      return notify("This role already exists.");
    }

    const role = {
      id: Date.now(),
      name,
      color: "#4776e6",
      users: [],
      permissions: [],
    };

    setRoles(prev => [...prev, role]);
    setSelectedId(role.id);
    setRoleName("");
    notify("Role created successfully.");
  }

  function deleteRole(id) {
    if (roles.length === 1) {
      return notify("Keep at least one role.");
    }

    const remaining = roles.filter(r => r.id !== id);
    setRoles(remaining);

    if (selectedId === id) setSelectedId(remaining[0].id);
    notify("Role deleted.");
  }

  function togglePermission(permissionId) {
    setRoles(prev => prev.map(role =>
      role.id !== selectedId
        ? role
        : {
            ...role,
            permissions: role.permissions.includes(permissionId)
              ? role.permissions.filter(p                                                                                                     => p !== permissionId)
              : [...role.permissions, permissionId],
          }
    ));
  }

  function toggleAllPermissions() {
    if (!selectedRole) return;

    const allSelected =
      selectedRole.permissions.length === permissionList.length;

    setRoles(prev => prev.map(role =>
      role.id === selectedId
        ? {
            ...role,
            permissions: allSelected
              ? []
              : permissionList.map(p => p.id),
          }
        : role
    ));
  }

  function assignUser(e) {
    e.preventDefault();

    if (!newUser) return notify("Choose a user first.");

    const alreadyAssigned = roles.some(role =>
      role.users.includes(newUser)
    );

    if (alreadyAssigned) {
      return notify("This user already has a role.");
    }

    setRoles(prev => prev.map(role =>
      role.id === selectedId
        ? { ...role, users: [...role.users, newUser] }
        : role
    ));

    setNewUser("");
    notify("User assigned successfully.");
  }

  function removeUser(user) {
    setRoles(prev => prev.map(role =>
      role.id === selectedId
        ? {
            ...role,
            users: role.users.filter(u => u !== user),
          }
        : role
    ));

    notify("User removed from role.");
  }

  const totalAssignments = roles.reduce(
    (sum, role) => sum + role.users.length,
    0
  );

  return (
    <div className={`dashboard ${dark ? "dark" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-logo">L</span>
          <span>Libra<span className="brand-light">Flow</span></span>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">L</div>
          <div>
            <strong>Central Library</strong>
            <small>Administration</small>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <nav className="nav">
          <button className="nav-item"
            onClick={() => notify("Dashboard overview selected.")}>
            <span>▦</span> Overview
          </button>
          <button className="nav-item"
            onClick={() => notify("Library management selected.")}>
            <span>▤</span> Library
          </button>
          <button className="nav-item"
            onClick={() => notify("Members section selected.")}>
            <span>♙</span> Members
          </button>
          <button className="nav-item active">
            <span>♧</span> Roles & Permissions
          </button>
          <button className="nav-item"
            onClick={() => notify("Reports section selected.")}>
            <span>▥</span> Reports
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-avatar">PV</div>
          <div className="admin-info">
            <strong>PrasadVarma</strong>
            <small>Super Admin</small>
          </div>
          <button className="theme-btn"
            onClick={() => setDark(v => !v)}
            title="Toggle theme">
            {dark ? "☀" : "☾"}
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <small className="eyebrow">WORKSPACE / SETTINGS</small>
            <h1>Roles & Permissions</h1>
            <p>Control access and manage your library team.</p>
          </div>

          <button className="theme-toggle"
            onClick={() => setDark(v => !v)}>
            {dark ? "☀ Light mode" : "☾ Dark mode"}
          </button>
        </header>

        {notice && (
          <div className="toast" role="status">
            <span>✓</span> {notice}
            <button onClick={() => setNotice("")}>×</button>
          </div>
        )}

        <section className="stats">
          <article className="stat-card">
            <div className="stat-icon purple">♧</div>
            <div><span>Total roles</span><strong>{roles.length}</strong></div>
          </article>
          <article className="stat-card">
            <div className="stat-icon green">♙</div>
            <div><span>Assigned users</span><strong>{totalAssignments}</strong></div>
          </article>
          <article className="stat-card">
            <div className="stat-icon orange">♢</div>
            <div><span>Available permissions</span><strong>{permissionList.length}</strong></div>
          </article>
        </section>

        <section className="content-grid">
          <article className="card roles-card">
            <div className="card-heading">
              <div>
                <h2>Access roles</h2>
                <p>Select a role to configure access.</p>
              </div>
              <span className="count">{roles.length} roles</span>
            </div>

            <label className="search-box">
              <span>⌕</span>
              <input
                placeholder="Search roles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </label>

            <div className="role-list">
              {filteredRoles.map(role => (
                <button
                  key={role.id}
                  className={`role-item ${
                    role.id === selectedId ? "selected" : ""
                  }`}
                  onClick={() => setSelectedId(role.id)}
                >
                  <span className="role-icon"
                    style={{ "--role-color": role.color }}>
                    {role.name.charAt(0).toUpperCase()}
                  </span>

                  <span className="role-description">
                    <strong>{role.name}</strong>
                    <small>
                      {role.users.length} users · {role.permissions.length} permissions
                    </small>
                  </span>

                  {role.id === selectedId && (
                    <span className="selected-check">✓</span>
                  )}
                </button>
              ))}

              {filteredRoles.length === 0 && (
                <p className="empty">No roles match your search.</p>
              )}
            </div>

            <form className="add-role-form" onSubmit={addRole}>
              <label htmlFor="roleName">Create a new role</label>
              <div className="add-role-row">
                <input
                  id="roleName"
                  value={roleName}
                  onChange={e => setRoleName(e.target.value)}
                  placeholder="e.g. Assistant"
                  maxLength={40}
                />
                <button className="primary-btn" type="submit">+ Add</button>
              </div>
            </form>

            <button
              className="delete-role"
              onClick={() => deleteRole(selectedId)}>
              Delete selected role
            </button>
          </article>

          <div className="right-column">
            {selectedRole ? (
              <>
                <article className="card permission-card">
                  <div className="card-heading">
                    <div>
                      <span className="eyebrow">ROLE CONFIGURATION</span>
                      <h2>{selectedRole.name}</h2>
                      <p>Choose what this role can access.</p>
                    </div>
                    <span className="role-icon large"
                      style={{ "--role-color": selectedRole.color }}>
                      {selectedRole.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="permission-summary">
                    <span>
                      <strong>{selectedRole.permissions.length}</strong> of{" "}
                      {permissionList.length} permissions enabled
                    </span>
                    <button onClick={toggleAllPermissions}>
                      {selectedRole.permissions.length === permissionList.length
                        ? "Deselect all"
                        : "Select all"}
                    </button>
                  </div>

                  <div className="progress">
                    <div style={{
                      width: `${selectedRole.permissions.length /
                        permissionList.length * 100}%`
                    }} />
                  </div>

                  <div className="permission-list">
                    {permissionList.map(permission => (
                      <label className="permission-row" key={permission.id}>
                        <span className="permission-symbol">◇</span>
                        <span className="permission-copy">
                          <strong>{permission.label}</strong>
                          <small>{permission.group}</small>
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedRole.permissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                        />
                      </label>
                    ))}
                  </div>

                  <div className="save-row">
                    <span>Changes apply immediately in this demo.</span>
                    <button className="primary-btn"
                      onClick={() => notify("Current role settings updated.")}>
                      ✓ Done
                    </button>
                  </div>
                </article>

                <article className="card users-card">
                  <div className="card-heading">
                    <div>
                      <h2>Assigned members</h2>
                      <p>Manage users with this role.</p>
                    </div>
                    <span className="count">{selectedRole.users.length} members</span>
                  </div>

                  <form className="assign-row" onSubmit={assignUser}>
                    <select value={newUser}
                      onChange={e => setNewUser(e.target.value)}>
                      <option value="">Choose a user...</option>
                      {users.filter(user =>
                        !roles.some(role => role.users.includes(user))
                      ).map(user => (
                        <option key={user} value={user}>{user}</option>
                      ))}
                    </select>
                    <button className="primary-btn" type="submit">
                      + Assign
                    </button>
                  </form>

                  <div className="member-list">
                    {selectedRole.users.map((user, index) => (
                      <div className="member-row" key={user}>
                        <div className={`member-avatar avatar-${index % 4}`}>
                          {user.split(" ").map(part => part[0]).join("")}
                        </div>
                        <div className="member-copy">
                          <strong>{user}</strong>
                          <small>{selectedRole.name}</small>
                        </div>
                        <button className="remove-btn"
                          onClick={() => removeUser(user)}
                          title={`Remove ${user}`}>
                          ×
                        </button>
                      </div>
                    ))}
                    {selectedRole.users.length === 0 && (
                      <p className="empty">No users assigned to this role yet.</p>
                    )}
                  </div>
                </article>
              </>
            ) : (
              <article className="card">
                <h2>Select a role</h2>
                <p>Choose a role from the list to manage its permissions.</p>
              </article>
            )}
          </div>
        </section>

        <footer className="footer">
          LibraFlow Admin · Interactive React Demo
        </footer>
      </main>
    </div>
  );
}
