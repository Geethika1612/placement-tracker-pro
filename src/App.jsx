import { useState, useEffect } from "react";

function App() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [packageValue, setPackageValue] = useState("");
  const [status, setStatus] = useState("Applied");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [dateApplied, setDateApplied] = useState("");
  const [editId, setEditId] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem("applications");

    if (saved) {
      setApplications(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "applications",
      JSON.stringify(applications)
    );
  }, [applications]);

  const addApplication = (e) => {
    e.preventDefault();

    if (!company || !role || !packageValue) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {

      const updatedApplications =
        applications.map((app) =>
          app.id === editId
            ? {
              ...app,
              company,
              role,
              package: packageValue,
              date: dateApplied,
              status,
            }
            : app
        );

      setApplications(updatedApplications);

      setEditId(null);

    } else {

      const newApplication = {
        id: Date.now(),
        company,
        role,
        package: packageValue,
        date: dateApplied,
        status,
      };

      setApplications([
        ...applications,
        newApplication,
      ]);
    }

    setCompany("");
    setRole("");
    setPackageValue("");
    setDateApplied("");
    setStatus("Applied");
  };

  const deleteApplication = (id) => {
    setApplications(
      applications.filter((app) => app.id !== id)
    );
  };
  const editApplication = (app) => {

    setCompany(app.company);
    setRole(app.role);
    setPackageValue(app.package);
    setDateApplied(app.date);
    setStatus(app.status);

    setEditId(app.id);
  };
  const filteredApplications = applications.filter(
    (app) => {
      const matchesSearch =
        app.company
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        app.status === filter;

      return matchesSearch && matchesFilter;
    }
  );

  const total = applications.length;

  const selected = applications.filter(
    (app) => app.status === "Selected"
  ).length;

  const interview = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "Rejected"
  ).length;
  const successRate =
    applications.length
      ? (selected / applications.length) * 100
      : 0;

  return (
    <div className="container">

      <nav className="navbar">

        <div className="logo">
          🚀 Placement Tracker Pro
        </div>

        <div className="nav-links">

          <a href="#dashboard">
            Dashboard
          </a>

          <a href="#applications">
            Applications
          </a>

          <a href="#analytics">
            Analytics
          </a>

        </div>

      </nav>

      <div className="welcome">

        <h2>Welcome Back 👋</h2>

        <p>
          Track internships and placements efficiently
        </p>

      </div>

      {/* Dashboard Cards */}
  
    <div id="dashboard">

      <div className="stats">

        <div className="stat-card">
          <h3>Total</h3>
          <h2>{total}</h2>
        </div>

        <div className="stat-card">
          <h3>Selected</h3>
          <h2>{selected}</h2>
        </div>

        <div className="stat-card">
          <h3>Interview</h3>
          <h2>{interview}</h2>
        </div>

        <div className="stat-card">
          <h3>Rejected</h3>
          <h2>{rejected}</h2>
        </div>
      </div>
      </div>
      <div id="analytics">
      <div className="card">

        <h3>
          Placement Success Rate
        </h3>

        <div className="progress">

          <div
            className="progress-fill"
            style={{
              width:
                `${successRate}%`
            }}
          ></div>

        </div>

        <p>
          {successRate.toFixed(1)}%
        </p>
        </div>
      </div>
      {/* Add Form */}

      <div className="card">

        <h2>Add Application</h2>

        <form onSubmit={addApplication}>

          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) =>
              setCompany(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Package (LPA)"
            value={packageValue}
            onChange={(e) =>
              setPackageValue(e.target.value)
            }
          />
          <input
            type="date"
            value={dateApplied}
            onChange={(e) =>
              setDateApplied(e.target.value)
            }
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option>Applied</option>
            <option>OA</option>
            <option>Interview</option>
            <option>Selected</option>
            <option>Rejected</option>
          </select>

          <button
            type="submit"
            className="add-btn"
          >
            {editId
              ? "Update Application"
              : "Add Application"}
          </button>

        </form>

      </div>

      {/* Search + Filter */}
   
      <div className="card">

        <input
          type="text"
          placeholder="Search Company..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>Applied</option>
          <option>OA</option>
          <option>Interview</option>
          <option>Selected</option>
          <option>Rejected</option>
        </select>

      </div>
      <div id="applications">
      <div className="applications">

        {filteredApplications.length === 0 && (
          <div className="empty">
            <h2>No Applications Yet 🚀</h2>
            <p>Add your first application</p>
          </div>
        )}

        {filteredApplications.map((app) => (

          <div
            className="application-card"
            key={app.id}
          >

            <h3>{app.company}</h3>

            <p>
              <strong>Role:</strong> {app.role}
            </p>

            <p>
              <strong>Package:</strong>
              {" "}
              {app.package} LPA
            </p>

            <p>
              <strong>Date:</strong>
              {" "}
              {app.date}
            </p>

            <span
              className={`badge ${app.status}`}
            >
              {app.status}
            </span>

            <div className="actions">
              <button
                className="edit-btn"
                onClick={() =>
                  editApplication(app)
                }
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete this application?"
                    )
                  ) {
                    deleteApplication(app.id);
                  }
                }}
              >
                Delete
              </button>

            </div>

          </div>

        ))}
      </div>
      </div>
      <footer>

        <p>
          Placement Tracker Pro © 2026
        </p>

      </footer>
    </div>
  );
}

export default App;