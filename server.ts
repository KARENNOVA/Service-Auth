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
    splitItems(arr: any[]): {
      oldwItems: any[];
      newItems: any[];
      deletedItems: any[];
    };
    splitItemsObject(arr: any[]);
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

if (!Array.prototype.splitItems)
  Array.prototype.splitItems = function (oldwItems) {
    const newItems = this.diff(oldwItems);
    const deletedItems = oldwItems.diff(this);
    return { oldwItems, newItems, deletedItems };
  };

if (!Array.prototype.splitItemsObject)
Array.prototype.splitItemsObject = function (Items, slug = "id") {
  const thisCorrect = this.every((item) => typeof item === "object");
  const oldItemCorrect = Items.every((item) => typeof item === "object");
  if (thisCorrect && oldItemCorrect) {
    const thisIds = this.map((i, index) => {
      if (i[slug]) {
        return i[slug];
      } else {
        this[index][slug] = `new${index}`;
        return `new${index}`;
      }
    });
    const oldItemsIds = Items.map((i) => i[slug]);
    const { oldwItems, newItems, deletedItems } =
      thisIds.splitItems(oldItemsIds);

    const a = this.filter((item) => newItems.includes(item[slug]));
    const b = Items.filter((item) => deletedItems.includes(item[slug]));
    const c = this.filter((item) => oldwItems.includes(item[slug]));
    a.filter((x) => delete x.id);
    return { oldwItems: c, newItems: a, deletedItems: b };
  }
};

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
