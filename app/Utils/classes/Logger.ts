import moment from "moment";
import { Manager } from "../enums";

export class Logger {
  private date: string;
  private ipv4: string;
  private manager: Manager;

  private log: string;

  constructor(ip: string, manager: Manager) {
    this.date = "";
    this.ipv4 = ip;
    this.manager = manager;
    this.log = "";
  }

  // PUBLIC METHODS
  /**
   * register
   */
  public register(line: number, method?: string, path?: string): string | void {
    this.date = moment().format("MMMM Do YYYY, h:mm:ss a");
    this.log += `${this.date} |  ${this.ipv4} | ${this.manager} | Línea ${line}`;

    if (method && path) {
      this.log += ` | ${method} | ${path}\n`;
      return `[ ${moment().format("MMMM Do YYYY, h:mm:ss a")} | ${
        this.ipv4
      } ]\t-> ${method}:\t${path}`;
    }
    this.log += "\n";
  }

  /**
   * getLog
   */
  public getLog(): string {
    return this.log;
  }

  // PRIVATE METHODS
}
