interface ValidatableInput {
  input: HTMLInputElement;

  name: string;
  value: string | number;

  needed?: boolean;

  minLength?: number;
  maxLength?: number;

  minValue?: number;
  maxValue?: number;
}

function validateInput(submittedInput: ValidatableInput): [boolean, string[]] {
  let isValidInput = true;
  let validationErrors: string[] = [];

  const inputName = submittedInput.name;
  const inputValue = submittedInput.value;

  const minimumLen = submittedInput.minLength;
  const maximumLen = submittedInput.maxLength;

  const minimumVal = submittedInput.minValue;
  const maximumVal = submittedInput.maxValue;

  if (submittedInput.needed) {
    const trimmedValue = inputValue.toString().trim();
    const isPresent = trimmedValue.length !== 0;

    isValidInput = isValidInput && isPresent;

    if (!isPresent) {
      validationErrors.push(
        `Field of <${inputName}> cannot be empty / must be present`
      );
    }
  }

  if (minimumLen != null && typeof inputValue === "string") {
    const isLengthAboveMinimum = inputValue.length >= minimumLen;

    isValidInput = isValidInput && isLengthAboveMinimum;

    if (!isLengthAboveMinimum) {
      validationErrors.push(
        `Length of <${inputName}> must be equal to or greater than ${minimumLen}`
      );
    }
  }

  if (maximumLen != null && typeof inputValue === "string") {
    const isLengthBelowMaximum = inputValue.length <= maximumLen;

    isValidInput = isValidInput && isLengthBelowMaximum;

    if (!isLengthBelowMaximum) {
      validationErrors.push(
        `Length of <${inputName}> must be equal to or lesser than ${maximumLen}`
      );
    }
  }

  if (minimumVal != null && typeof inputValue === "number") {
    const isValueGreaterThanMinimum = inputValue >= minimumVal;

    isValidInput = isValidInput && isValueGreaterThanMinimum;

    if (!isValueGreaterThanMinimum) {
      validationErrors.push(
        `Value of <${inputName}> must be equal to or greater than ${minimumVal}`
      );
    }
  }

  if (maximumVal != null && typeof inputValue === "number") {
    const isValueLesserThanMaximum = inputValue <= maximumVal;

    isValidInput = isValidInput && isValueLesserThanMaximum;

    if (!isValueLesserThanMaximum) {
      validationErrors.push(
        `Value of <${inputName}> must be equal to or lesser than ${maximumVal}`
      );
    }
  }

  return [isValidInput, validationErrors];
}

function showCustomAlert(errorMessages: string[]) {
  let customMessage = "";

  if (errorMessages.length > 0) {
    customMessage = `Invalid input! Please try again. Errors: \n${errorMessages.join(
      "; and, \n"
    )}.`;
  }

  if (customMessage.length > 0) {
    alert(customMessage);
  }
}

function customFocus(validatableInputs: ValidatableInput[]): void {
  for (const validatableInput of validatableInputs) {
    const [isValid, _]: [boolean, string[]] = validateInput(validatableInput);

    if (!isValid) {
      validatableInput.input.focus();
      break;
    }
  }
}

function AutoBind(_1: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,

    get() {
      return originalMethod.bind(this);
    },
  };

  return adjustedDescriptor;
}

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  public addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

enum ProjectStatus {
  Active = "active",
  Finished = "finished",
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public peopleCount: number,
    public status: ProjectStatus
  ) {}
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();

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

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  protected templateElement: HTMLTemplateElement;
  protected hostElement: T;
  protected specificElement: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    specificElementId?: string
  ) {
    // `templateElement` gives access to the Template that holds this Template Content
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    // `hostElement` holds a Reference to the Element where Template Content will be rendered
    this.hostElement = document.getElementById(hostElementId)! as T;

    // Deep Cloning => all the Levels of Nesting inside the Template
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.specificElement = importedNode.firstElementChild as U;

    if (specificElementId) {
      this.specificElement.id = specificElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.specificElement
    );
  }

  protected abstract configure(): void;
  protected renderContent?(): void;
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  private titleInputElement: HTMLInputElement;
  private descriptionInputElement: HTMLInputElement;
  private peopleCountInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputElement = this.specificElement.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.specificElement.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleCountInputElement = this.specificElement.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
  }

  protected configure() {
    this.specificElement.addEventListener("submit", this.submitHandler);
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle: string = this.titleInputElement.value;
    const enteredDescription: string = this.descriptionInputElement.value;
    const enteredPeopleCount: number = +this.peopleCountInputElement.value;

    const titleValidatable: ValidatableInput = {
      input: this.titleInputElement,
      name: "Title",
      value: enteredTitle,
      needed: true,
    };

    const descriptionValidatable: ValidatableInput = {
      input: this.descriptionInputElement,
      name: "Description",
      value: enteredDescription,
      needed: true,
      minLength: 5,
    };

    const peopleCountValidatable: ValidatableInput = {
      input: this.peopleCountInputElement,
      name: "People",
      value: +enteredPeopleCount,
      needed: true,
      minValue: 4,
      maxValue: 7,
    };

    const [isTitleValid, titleErrors]: [boolean, string[]] =
      validateInput(titleValidatable);
    const [isDescriptionValid, descriptionErrors]: [boolean, string[]] =
      validateInput(descriptionValidatable);
    const [isPeopleCountValid, peopleErrors]: [boolean, string[]] =
      validateInput(peopleCountValidatable);

    const isValidForm =
      isTitleValid && isDescriptionValid && isPeopleCountValid;

    if (!isValidForm) {
      // Shows a proper Custom Alert
      showCustomAlert(
        titleErrors.concat(descriptionErrors).concat(peopleErrors)
      );

      // Focus on the first Input with issues
      customFocus([
        titleValidatable,
        descriptionValidatable,
        peopleCountValidatable,
      ]);

      // If the function includes a `void` as possible output,
      // then the returned `undefined` value will be ignored
      return;
    } else {
      return [enteredTitle, enteredDescription, enteredPeopleCount];
    }
  }

  @AutoBind
  private submitHandler(event: Event) {
    // Prevents the default HTTP Request
    event.preventDefault();

    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      prjState.addProject(title, desc, people);

      this.clearInputs();
    }
  }

  private clearInputs = () => this.specificElement.reset();
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  private listId: string;
  private assignedProjects: Project[];

  constructor(private type: ProjectStatus) {
    super("project-list", "app", false, `${type}-projects`);

    this.listId = `${type}-projects-list`;
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  protected configure() {
    prjState.addListener((projects: Project[]) => {
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
    // console.log(document.querySelector(`#${this.listId}`));

    const listElement = document.getElementById(
      this.listId
    )! as HTMLUListElement;

    listElement.innerHTML = "";

    for (const relevantProject of this.assignedProjects) {
      new ProjectItem(listElement.id, relevantProject);
    }
  }
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
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

  protected configure() {}

  protected renderContent() {
    const title = this.specificElement.querySelector("h2")!;
    title.textContent = this.project.title;

    const people = this.specificElement.querySelector("h3")!;
    people.textContent = this.peopleCount;

    const description = this.specificElement.querySelector("p")!;
    description.textContent = this.project.description;
  }
}

const prjState = ProjectState.getInstance();

const prjInput = new ProjectInput();

const activeProjects = new ProjectList(ProjectStatus.Active);
const finishedProjects = new ProjectList(ProjectStatus.Finished);
