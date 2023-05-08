import { ProjectList } from "./integrant/list";
import { ProjectInput } from "./integrant/input";
import { ProjectStatus } from "./entity/project";

new ProjectInput();

new ProjectList(ProjectStatus.Active);
new ProjectList(ProjectStatus.Finished);
