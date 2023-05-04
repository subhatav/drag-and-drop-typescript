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

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleCountInputElement: HTMLInputElement;

  constructor() {
    // `templateElement` gives access to the Template that holds this Template Content
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    // `hostElement` holds a Reference to the Element where Template Content will be rendered
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    // Deep Cloning => all the Levels of Nesting inside the Template
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = "user-input";

    this.titleInputElement = this.formElement.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleCountInputElement = this.formElement.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
    this.attach(this.formElement);
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
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private clearInputs = () => this.formElement.reset();

  private configure() {
    this.formElement.addEventListener("submit", this.submitHandler);
  }

  private attach(fragment: Element) {
    this.hostElement.insertAdjacentElement("afterbegin", fragment);
  }
}

const myProject = new ProjectInput();
