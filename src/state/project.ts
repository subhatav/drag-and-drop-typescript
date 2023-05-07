namespace App {
  type Listener<T> = (items: T[]) => void;

  class State<T> {
    protected listeners: Listener<T>[] = [];

    public addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn);
    }
  }

  export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
      super();
    }

    static getInstance() {
      if (!this.instance) {
        this.instance = new ProjectState();
      }

      return this.instance;
    }

    public addProject(title: string, description: string, peopleCount: number) {
      const project = new Project(
        Math.random().toString(),
        title,
        description,
        peopleCount,
        ProjectStatus.Active
      );

      this.projects.push(project);
      this.updateListeners();
    }

    public moveProject(projectId: string, projectStatus: ProjectStatus) {
      const project = this.projects.find(
        (project: Project): boolean => project.id === projectId
      );

      if (project && project.status !== projectStatus) {
        project.status = projectStatus;
        this.updateListeners();
      }
    }

    private updateListeners() {
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice());
      }
    }
  }

  export const projectState = ProjectState.getInstance();
}
