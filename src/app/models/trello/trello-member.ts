import { JsonTrelloMember } from "../trello-json/json-trello-member";

export class TrelloMember {
  public readonly username: string = "";
  public readonly fullName: string = "";
  public readonly initials: string = "";
  public readonly profileLink: string = "";
  public readonly profilePicture: string = "";

  constructor(jsonMember: JsonTrelloMember) {
    this.username = jsonMember.username;
    this.fullName = jsonMember.fullName;
    this.initials = jsonMember.initials;
    this.profileLink = jsonMember.url;
    this.profilePicture = `${jsonMember.avatarUrl}/50.png`;
  }
}
