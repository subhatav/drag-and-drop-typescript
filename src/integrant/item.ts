import Foundation from "./base.js";
import { Project } from "../entity/project.js";
import { Draggable } from "../entity/drag-drop.js";
import { AutoBind } from "../decorator/auto-bind.js";

export class ProjectItem
  extends Foundation<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get peopleCount() {
    return (
      this.project.peopleCount +
      " Person" +
      (this.project.peopleCount === 1 ? "" : "s")
    );
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @AutoBind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent) {}

  protected configure() {
    this.specificElement.addEventListener("dragstart", this.dragStartHandler);
    this.specificElement.addEventListener("dragend", this.dragEndHandler);
  }

  protected renderContent() {
    const title = this.specificElement.querySelector("h2")!;
    title.textContent = this.project.title;

    const people = this.specificElement.querySelector("h3")!;
    people.textContent = this.peopleCount;

    const description = this.specificElement.querySelector("p")!;
    description.textContent = this.project.description;
  }
}
