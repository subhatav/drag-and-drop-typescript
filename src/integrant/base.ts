namespace App {
  export abstract class Component<
    T extends HTMLElement,
    U extends HTMLElement
  > {
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
}
