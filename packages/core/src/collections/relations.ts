/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2023 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import CachedCollection from "../database/cached-collection";
import { ItemReference, ItemType, Relation } from "../entities";
import { IStorage } from "../interfaces";
import { makeId } from "../utils/id";
import { ICollection } from "./collection";

export class Relations implements ICollection<"relations", Relation> {
  private readonly collection: CachedCollection<"relations", Relation>;

  constructor(storage: IStorage) {
    this.collection = new CachedCollection(storage, "relations");
  }

  async merge(relation: Relation) {
    await this.collection.addItem(relation);
  }

  async add(from: ItemReference, to: ItemReference) {
    if (
      this.all.find(
        (a) =>
          compareItemReference(a.from, from) && compareItemReference(a.to, to)
      )
    )
      return;

    const relation: Relation = {
      id: generateId(from, to),
      type: "relation",
      dateCreated: Date.now(),
      dateModified: Date.now(),
      from: { id: from.id, type: from.type },
      to: { id: to.id, type: to.type }
    };

    await this.collection.addItem(relation);
  }

  from(reference: ItemReference, type: ItemType) {
    const relations = this.all.filter(
      (a) => compareItemReference(a.from, reference) && a.to.type === type
    );
    return this.resolve(relations, "to");
  }

  to(reference: ItemReference, type: ItemType) {
    const relations = this.all.filter(
      (a) => compareItemReference(a.to, reference) && a.from.type === type
    );
    return this.resolve(relations, "from");
  }

  /**
   * Count number of from -> to relations
   */
  count(reference: ItemReference, type: ItemType) {
    return this.all.filter(
      (a) => compareItemReference(a.from, reference) && a.to.type === type
    ).length;
  }

  get raw() {
    return this.collection.getRaw();
  }

  get all() {
    return this.collection.getItems();
  }

  relation(id: string) {
    return this.collection.getItem(id);
  }

  async remove(...ids: string[]) {
    for (const id of ids) {
      await this.collection.removeItem(id);
    }
  }

  async unlink(from: ItemReference, to: ItemReference) {
    const relation = this.all.find(
      (a) =>
        compareItemReference(a.from, from) && compareItemReference(a.to, to)
    );
    if (!relation) return;

    await this.remove(relation.id);
  }

  async unlinkAll(to: ItemReference, type: ItemType) {
    for (const relation of this.all.filter(
      (a) => compareItemReference(a.to, to) && a.from.type === type
    )) {
      await this.remove(relation.id);
    }
  }

  private resolve(relations: Relation[], resolveType: "from" | "to") {
    const items = [];
    for (const relation of relations) {
      const reference = resolveType === "from" ? relation.from : relation.to;
      let item = null;
      switch (reference.type) {
        case "reminder":
          item = this._db.reminders.reminder(reference.id);
          break;
        case "note": {
          const note = this._db.notes.note(reference.id);
          if (!note) continue;
          item = note.data;
          break;
        }
        case "notebook": {
          const notebook = this._db.notebooks.notebook(reference.id);
          if (!notebook) continue;
          item = notebook.data;
          break;
        }
      }
      if (item) items.push(item);
    }
    return items;
  }

  async cleanup() {
    const relations = this.collection.getItems();
    for (const relation of relations) {
      const references = [relation.to, relation.from];
      for (const reference of references) {
        let exists = false;
        switch (reference.type) {
          case "reminder":
            exists = this._db.reminders.exists(reference.id);
            break;
          case "note":
            exists =
              this._db.notes.exists(reference.id) ||
              this._db.trash.exists(reference.id);
            break;
          case "notebook":
            exists =
              this._db.notebooks.exists(reference.id) ||
              this._db.trash.exists(reference.id);
            break;
        }
        if (!exists) await this.remove(relation.id);
      }
    }
  }
}

function compareItemReference(a: ItemReference, b: ItemReference) {
  return a.id === b.id && a.type === b.type;
}

/**
 * Generate a deterministic constant id from `a` & `b` item reference.
 */
function generateId(a: ItemReference, b: ItemReference) {
  const str = `${a.id}${b.id}${a.type}${b.type}`;
  return makeId(str);
}