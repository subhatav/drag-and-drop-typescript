namespace App {
  export interface ValidatableInput {
    input: HTMLInputElement;

    name: string;
    value: string | number;

    needed?: boolean;

    minLength?: number;
    maxLength?: number;

    minValue?: number;
    maxValue?: number;
  }

  export function validateInput(
    submittedInput: ValidatableInput
  ): [boolean, string[]] {
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

  export function showCustomAlert(errorMessages: string[]) {
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

  export function customFocus(validatableInputs: ValidatableInput[]): void {
    for (const validatableInput of validatableInputs) {
      const [isValid, _]: [boolean, string[]] = validateInput(validatableInput);

      if (!isValid) {
        validatableInput.input.focus();
        break;
      }
    }
  }
}
