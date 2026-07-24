import { ProjectListSchema, type Project } from "@vcqa-ref/shared";
import { useEffect, useState } from "react";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; projects: Project[] }
  | { status: "failed"; message: string };

export function App() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    void fetchProjects()
      .then((projects) => {
        if (active) {
          setState({ status: "ready", projects });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: "failed",
            message: error instanceof Error ? error.message : "Unable to load projects"
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="shell">
      <header className="masthead">
        <p className="eyebrow">VibeCode QA reference</p>
        <h1>Firebase React Fullstack</h1>
        <p>
          A small product-neutral fixture for Firebase Hosting, Functions, Firestore,
          shared TypeScript contracts, and emulator-backed evidence.
        </p>
      </header>

      <section aria-labelledby="projects-title" className="panel">
        <div>
          <p className="eyebrow">API boundary</p>
          <h2 id="projects-title">Projects</h2>
        </div>
        {state.status === "loading" ? <p role="status">Loading projects...</p> : null}
        {state.status === "failed" ? <p role="alert">{state.message}</p> : null}
        {state.status === "ready" ? (
          state.projects.length > 0 ? (
            <ul>
              {state.projects.map((project) => (
                <li key={project.id}>
                  <strong>{project.name}</strong>
                  <span>{project.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p role="status">No projects yet.</p>
          )
        ) : null}
      </section>
    </main>
  );
}

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch("/api/projects", {
    headers: {
      "x-vcqa-user": "demo-user"
    }
  });

  if (!response.ok) {
    throw new Error(`API failed with ${response.status}`);
  }

  const parsed = ProjectListSchema.parse(await response.json());
  return parsed.projects;
}

