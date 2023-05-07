/// <reference path="./integrant/input.ts"/>
/// <reference path="./integrant/list.ts"/>

namespace App {
  new ProjectInput();

  new ProjectList(ProjectStatus.Active);
  new ProjectList(ProjectStatus.Finished);
}
