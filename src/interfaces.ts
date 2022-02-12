export interface Person {
  id?: string;
  profile?: string;
  name: Name;
  mobile: Set<string>;
  telephone: Set<string>;
  links: Social;
  address: Location;
  relate?: unknown;
}

export interface Name {
  firstName: string;
  lastName: string;
  relate: Person;
}

export interface Social {
  [key: string]: string | Person;
}

export interface Location {
  region: string;
  country: string;
  city: string;
  town: string;
  postalCode: number;
  relate?: Person;
}

// export interface ContactsGroups {
//   [letter: string]: Map<string, Contacts | Contact>;
// }

// export interface Contacts {
//   [id: string]: Map<string, Person | ContactsGroups>;
// }

export interface Contact {
  length: number;
  // groups: ContactsGroups;

  add(newPerson: Person): this;
  get(letter: string, id: string): Person | null;
  delete(letter: string, id: string): Person | null;
  edit(
    letter: string,
    id: string,
    callback: (oldPerson: Person) => Person
  ): Person | null;
  clone(): Contact;
  clear(): this;
}
