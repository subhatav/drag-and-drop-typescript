import { ProjectList } from "./integrant/list.js";
import { ProjectInput } from "./integrant/input.js";
import { ProjectStatus } from "./entity/project.js";

new ProjectInput();

new ProjectList(ProjectStatus.Active);
new ProjectList(ProjectStatus.Finished);
