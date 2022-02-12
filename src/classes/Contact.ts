import { produce } from "immer";
import { Person } from "../interfaces";

type PersonMap = Map<string, Person>;
type Group = Map<string, PersonMap>;

class Contact {
  private _totalLength: number = 0;
  private _searchableString: string = "";
  public groups: Group = new Map();

  constructor() {
    this._searchableString = "";
  }

  get length(): number {
    return this._totalLength;
  }

  private formatNameId(
    firstName: string,
    lastName: string,
    id: string
  ): string {
    const fullName: string = `${firstName} ${lastName}`;
    const format: string = `${fullName}:${id},`;

    return format;
  }

  private addToSearchString(formatNameId: string): void {
    this._searchableString = `${formatNameId}${this._searchableString}`;
  }

  private findPerson(letter: string, id: string): Person | null {
    const PersonMap = this.groups.get(letter)?.get(id);

    if (!PersonMap) {
      return null;
    }

    return PersonMap as Person;
  }

  private toJsonReplacer(): (key: string, value: unknown) => unknown {
    const weakSet: WeakSet<object> = new WeakSet();

    return (_: string, value: object | unknown) => {
      if (typeof value === "object" && value !== null) {
        if (weakSet.has(value as object)) {
          return;
        }

        weakSet.add(value as object);
      }

      // if the value is Map
      if (value instanceof Map) {
        value = Object.fromEntries(value);
      }

      // if the value is Set
      if (value instanceof Set) {
        value = Array.from(value);
      }

      if (value) {
        return value;
      }
    };
  }

  add(newPerson: Person): this {
    const { firstName, lastName } = newPerson.name;
    const { id } = newPerson;

    if (!id) {
      return this;
    }

    delete newPerson.id;

    const formatNameId: string = this.formatNameId(firstName, lastName, id);

    this.addToSearchString(formatNameId);

    const firstLetter: string = firstName.at(0)!.toLocaleUpperCase();

    // if the first letter doesn't exist on this.groups object
    if (!this.groups.has(firstLetter)) {
      const newPersonMap: PersonMap = new Map();
      this.groups.set(firstLetter, newPersonMap);
    }

    // add circular relation to the groups
    newPerson.relate = this.groups;

    this.groups.get(firstLetter)?.set(id, newPerson);
    this._totalLength++;

    return this;
  }

  get(letter: string, id: string): Person | null {
    const PersonMap: Person = this.findPerson(letter, id)!;

    // set again id
    PersonMap.id = id;

    if (PersonMap) {
      // get the PersonMap with O(1) complexity
      return PersonMap;
    }

    return null;
  }

  delete(letter: string, id: string): Person | null {
    const PersonMap: Person = this.findPerson(letter, id)!;

    if (!PersonMap) {
      return null;
    }

    // delete the contact with O(1) complexity
    this.groups.get(letter)?.delete(id);

    if (this.groups.get(letter)?.size === 0) {
      this.groups.delete(letter);
    }

    this._totalLength--;

    // delete from searchable string
    const {
      name: { firstName, lastName },
    } = PersonMap;
    const formatNameId: string = this.formatNameId(firstName, lastName, id);

    this._searchableString = this._searchableString.replace(
      `${formatNameId}`,
      ""
    );

    return PersonMap;
  }

  deleteLast(deleteCount: number): boolean {
    if (deleteCount > this.length) {
      return false;
    }

    const deletionRegex: RegExp = new RegExp(
      `(?<name>(\\w|\\s)*(?<id>:(\\w+-){4}\\w+),){${deleteCount}}`
    );

    const selectedPerson: string[] =
      this._searchableString.match(deletionRegex)!;

    if (!selectedPerson) {
      return false;
    }

    selectedPerson
      .at(0)
      ?.split(",")
      .filter(Boolean)
      .forEach((PersonMap: string) => {
        const [fullName, id] = PersonMap.split(":");
        const firstLetter: string = fullName.at(0)!.toUpperCase();

        this.delete(firstLetter, id);
      });

    return true;
  }

  edit(
    letter: string,
    id: string,
    callback: (oldPerson: Person) => Person
  ): Person | null {
    const oldPerson: Person = this.findPerson(letter, id)!;

    if (!oldPerson) {
      return null;
    }

    const editedPerson: Person = produce(oldPerson, (draft) => callback(draft));

    this.add(editedPerson);

    return editedPerson;
  }

  search(searchText: string): [string[], number] {
    const searchPattern: RegExp = new RegExp(
      `(?<name>(\\w|\\s)*(${searchText})(\\w|\\s)*)(?<id>:(\\w+-){4}\\w+)`,
      "g"
    );

    const searchResult: string[] =
      this._searchableString.match(searchPattern) ?? [];
    const resultLength: number = searchResult.length;

    return [searchResult, resultLength];
  }

  clone(): Contact {
    const newContact: Contact = new Contact();

    newContact._totalLength = this.length;
    newContact._searchableString = this._searchableString;
    newContact.groups = this.groups;

    return newContact;
  }

  clear(): this {
    this._totalLength = 0;
    this._searchableString = "";
    this.groups.clear();

    return this;
  }

  toString(indent?: number): Promise<string> {
    return Promise.resolve(JSON.stringify(this, this.toJsonReplacer(), indent));
  }
}

export default Contact;
