import { prefixes } from '../../bindings/crypto/constants.js';
import { prefixToField } from '../../bindings/lib/binable.js';
export { createEvents, dataAsHash };
function createEvents({ Field, Poseidon, }) {
    // hashing helpers
    function initialState() {
        return [Field(0), Field(0), Field(0)];
    }
    function salt(prefix) {
        return Poseidon.update(initialState(), [prefixToField(Field, prefix)]);
    }
    function hashWithPrefix(prefix, input) {
        let init = salt(prefix);
        return Poseidon.update(init, input)[0];
    }
    function emptyHashWithPrefix(prefix) {
        return salt(prefix)[0];
    }
    const Events = {
        empty() {
            let hash = emptyHashWithPrefix('MinaZkappEventsEmpty');
            return { hash, data: [] };
        },
        pushEvent(events, event) {
            let eventHash = hashWithPrefix(prefixes.event, event);
            let hash = hashWithPrefix(prefixes.events, [events.hash, eventHash]);
            return { hash, data: [event, ...events.data] };
        },
        fromList(events) {
            return [...events].reverse().reduce(Events.pushEvent, Events.empty());
        },
        hash(events) {
            return Events.fromList(events).hash;
        },
    };
    const EventsProvable = {
        ...Events,
        ...dataAsHash({
            empty: Events.empty,
            toValue(data) {
                return data.map((row) => row.map((e) => Field.toBigint(e)));
            },
            fromValue(value) {
                return value.map((row) => row.map((e) => Field(e)));
            },
            toJSON(data) {
                return data.map((row) => row.map((e) => Field.toJSON(e)));
            },
            fromJSON(json) {
                let data = json.map((row) => row.map((e) => Field.fromJSON(e)));
                let hash = Events.hash(data);
                return { data, hash };
            },
            Field,
        }),
    };
    const Actions = {
        // same as events but w/ different hash prefixes
        empty() {
            let hash = emptyHashWithPrefix('MinaZkappActionsEmpty');
            return { hash, data: [] };
        },
        pushEvent(actions, event) {
            let eventHash = hashWithPrefix(prefixes.event, event);
            let hash = hashWithPrefix(prefixes.sequenceEvents, [
                actions.hash,
                eventHash,
            ]);
            return { hash, data: [event, ...actions.data] };
        },
        fromList(events) {
            return [...events].reverse().reduce(Actions.pushEvent, Actions.empty());
        },
        hash(events) {
            return this.fromList(events).hash;
        },
        // different than events
        emptyActionState() {
            return emptyHashWithPrefix('MinaZkappActionStateEmptyElt');
        },
        updateSequenceState(state, sequenceEventsHash) {
            return hashWithPrefix(prefixes.sequenceEvents, [
                state,
                sequenceEventsHash,
            ]);
        },
    };
    const ActionsProvable = {
        ...Actions,
        ...dataAsHash({
            empty: Actions.empty,
            toValue(data) {
                return data.map((row) => row.map((e) => Field.toBigint(e)));
            },
            fromValue(value) {
                return value.map((row) => row.map((e) => Field(e)));
            },
            toJSON(data) {
                return data.map((row) => row.map((e) => Field.toJSON(e)));
            },
            fromJSON(json) {
                let data = json.map((row) => row.map((e) => Field.fromJSON(e)));
                let hash = Actions.hash(data);
                return { data, hash };
            },
            Field,
        }),
    };
    return { Events: EventsProvable, Actions: ActionsProvable };
}
function dataAsHash({ empty, toValue, fromValue, toJSON, fromJSON, Field, }) {
    return {
        empty,
        sizeInFields() {
            return 1;
        },
        toFields({ hash }) {
            return [hash];
        },
        toAuxiliary(value) {
            return [value?.data ?? empty().data];
        },
        fromFields([hash], [data]) {
            return { data, hash };
        },
        toValue({ data, hash }) {
            return { data: toValue(data), hash: Field.toBigint(hash) };
        },
        fromValue({ data, hash }) {
            return { data: fromValue(data), hash: Field(hash) };
        },
        toJSON({ data }) {
            return toJSON(data);
        },
        fromJSON(json) {
            return fromJSON(json);
        },
        check() { },
        toInput({ hash }) {
            return { fields: [hash] };
        },
    };
}
//# sourceMappingURL=events.js.map