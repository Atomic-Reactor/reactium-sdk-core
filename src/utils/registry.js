import _ from 'underscore';
import op from 'object-path';
import uuid from 'uuid/v4';

export default class Registry {
    constructor(name, idField) {
        this.__name = name || 'Registry';
        this.__idField = idField || 'id';
        this.__protected = [];
        this.__registered = [];
        this.__unregister = [];
    }

    get protected() {
        return this.__protected;
    }

    get registered() {
        return this.__registered;
    }

    get unregistered() {
        return this.__unregister;
    }

    get list() {
        const unregister = _.uniq(this.__unregister);
        const registered = Array.from(this.__registered).filter(
            item => !unregister.includes(item[this.__idField]),
        );

        return Object.values(
            _.chain(registered)
                .sortBy('order')
                .indexBy(this.__idField)
                .value(),
        );
    }

    isProtected(id) {
        return this.__protected.includes(id);
    }

    isRegistered(id) {
        return !!_.findWhere(this.__registered, { id });
    }

    protect(id) {
        this.__protected = _.chain([this.__protected, [id]])
            .flatten()
            .uniq()
            .value();

        return this;
    }

    register(id, data = {}) {
        if (!id) id = uuid();

        if (this.isProtected(id) && this.isRegistered(id)) {
            return new Error(
                `${this.__name} unable to replace protected item ${id}`,
            );
        }

        data['order'] = op.get(data, 'order', 100);
        const item = { ...data, [this.__idField]: id };
        this.__registered.push(item);
        return this;
    }

    unprotect(id) {
        this.__protected = _.without(this.__protected, id);
        return this;
    }

    unregister(id) {
        if (!id) return this;

        id = _.chain([id])
            .flatten()
            .uniq()
            .value();

        id.forEach(() => {
            if (this.__protected.includes(id)) return;
            this.__unregister.push(id);
        });

        return this;
    }
}
