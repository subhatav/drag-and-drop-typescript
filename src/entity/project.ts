export enum ProjectStatus {
  Active = "active",
  Finished = "finished",
}

export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public peopleCount: number,
    public status: ProjectStatus
  ) {}
}
