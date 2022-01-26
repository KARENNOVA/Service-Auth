/*
|--------------------------------------------------------------------------
| AdonisJs Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJs application
| and start the HTTP server to accept incoming connections. You must avoid
| making this file dirty and instead make use of `lifecycle hooks` provided
| by AdonisJs service providers for custom code.
|
*/

declare global {
  interface Array<T> {
    diff(arr: T[]): T[];
    splitItems(arr: any[]);
  }

  interface String {
    capitalize(): String;
  }

}

Array.prototype.diff = function (a) {
  return this.filter(function (i) {
    return a.indexOf(i) < 0;
  });
};

if (!Array.prototype.splitItems) {
  Array.prototype.splitItems = function (oldwItems) {
    let newItems: any[] = [];
    let deletedItems: any[] = [];
    this.map(p => {
      if (typeof p === "number") {
        if (!oldwItems.includes(p)) {
          newItems = [...newItems, p]
        }
      } else if (typeof p === "object") {
        if (!oldwItems.includes(p.id)){
          newItems = [...newItems,  p]
        }
      }
    });
    oldwItems.map(p => {
      if (typeof p === "number") {
        if(!this.includes(p)){
          deletedItems = [...deletedItems, p];
        }
      } else if (typeof p === "object") {
        if(!this.includes(p)){
          deletedItems = [...deletedItems, p];
        }
      }
    })
    // newItems = this.diff(oldwItems);
    // deletedItems = oldwItems.diff(this);
    return { oldwItems, newItems, deletedItems }
  };
}



if (!String.prototype.capitalize) {
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
}

import "reflect-metadata";
import sourceMapSupport from "source-map-support";
import { Ignitor } from "@adonisjs/core/build/standalone";

sourceMapSupport.install({ handleUncaughtExceptions: false });

new Ignitor(__dirname).httpServer().start();
