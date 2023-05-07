/// <reference path="./base.ts"/>

/// <reference path="../entity/project.ts"/>
/// <reference path="../entity/drag-drop.ts"/>

/// <reference path="../state/project.ts"/>
/// <reference path="../decorator/auto-bind.ts"/>

namespace App {
  export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    private listId: string;
    private assignedProjects: Project[];

    constructor(private type: ProjectStatus) {
      super("project-list", "app", false, `${type}-projects`);

      this.listId = `${type}-projects-list`;
      this.assignedProjects = [];

      this.configure();
      this.renderContent();
    }

    @AutoBind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();

        const listElement = this.specificElement.querySelector("ul")!;
        listElement.classList.add("droppable");
      }
    }

    @AutoBind
    dropHandler(event: DragEvent) {
      const projectId = event.dataTransfer!.getData("text/plain");
      projectState.moveProject(projectId, this.type);
    }

    @AutoBind
    dragLeaveHandler(_: DragEvent) {
      const listElement = this.specificElement.querySelector("ul")!;
      listElement.classList.remove("droppable");
    }

    protected configure() {
      this.specificElement.addEventListener("dragover", this.dragOverHandler);
      this.specificElement.addEventListener("drop", this.dropHandler);
      this.specificElement.addEventListener("dragleave", this.dragLeaveHandler);

      projectState.addListener((projects: Project[]) => {
        this.assignedProjects = projects.filter(
          (project) => project.status === this.type
        );

        this.renderProjects();
      });
    }

    protected renderContent() {
      this.specificElement.querySelector("ul")!.id = this.listId;
      this.specificElement.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " PROJECTS";
    }

    private renderProjects() {
      const listElement = document.getElementById(
        this.listId
      )! as HTMLUListElement;

      listElement.innerHTML = "";

      for (const relevantProject of this.assignedProjects) {
        new ProjectItem(listElement.id, relevantProject);
      }
    }
  }
}
