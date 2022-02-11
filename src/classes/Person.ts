import { v4 } from "uuid";
import {
  Location,
  Name,
  Person as PersonInterface,
  Social,
} from "../interfaces";

class Person implements PersonInterface {
  readonly id: string = v4();
  public profile?: string;
  public name: Name;
  public mobile: Set<string>;
  public telephone: Set<string>;
  public links: Social;
  public address: Location;
  public relate?: unknown;

  private createName(firstName: string, lastName: string): Name {
    const name: Name = {
      firstName,
      lastName,
      relate: this,
    };

    return name;
  }

  private createLinks(socialObject: Social): Social {
    const socialLinks: Social = {
      ...socialObject,
      relate: this,
    };

    return socialLinks;
  }

  private createLocation(location: Location): Location {
    const personLocation: Location = {
      ...location,
      relate: this,
    };

    return personLocation;
  }

  constructor(
    firstName: string,
    lastName: string,
    phone: string[],
    links: Social,
    location: Location,
    profile?: string,
    telephone?: string[]
  ) {
    this.name = this.createName(firstName, lastName);
    this.mobile = new Set(phone);
    this.telephone = new Set(telephone);
    this.links = this.createLinks(links);
    this.address = this.createLocation(location);
    this.profile = profile || "";
  }
}

export default Person;
