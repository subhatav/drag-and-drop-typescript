/// <reference path="./base.ts"/>

/// <reference path="../state/project.ts"/>
/// <reference path="../utility/validation.ts"/>
/// <reference path="../decorator/auto-bind.ts"/>

namespace App {
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
        projectState.addProject(title, desc, people);

        this.clearInputs();
      }
    }

    private clearInputs = () => this.specificElement.reset();
  }
}
