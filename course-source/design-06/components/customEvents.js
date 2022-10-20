/**
 * A series of custom events that help identify what is happening
 * and also allows us to pass data where needed.
 */

export const adding = 'adding';
export const addingEvent = new CustomEvent(adding);

export const added = 'added';
/**
 * API call adding an objective was successful
 *
 * @param {string} id - objective ID
 * @param {string} title - objective ID
 * @return {CustomEvent} detail object with id and title
 */
export const addedEvent = function (id, title) {
  return new CustomEvent(added, { detail: { id, title } });
}

export const deleting = 'deleting';
export const deletingEvent = new CustomEvent(deleting);

export const deleted = 'deleted';
/**
 * API call deleting an objective was successful
 *
 * @param {string} id - objective ID
 * @return {CustomEvent} detail object with id
 */
export const deletedEvent = function (id) {
  return new CustomEvent(deleted, { detail: { id } });
}

export const updating = 'updating';
export const updatingEvent = new CustomEvent(updating);

export const updated = 'updated';
export const updatedEvent = new CustomEvent(updated);

export const saving = 'saving';
/**
 * API call saving an objective was successful
 *
 * @param {array} changedIds - A list of objective IDs
 * @return {CustomEvent} detail object with id
 */
export const savingEvent = function (changedIds) {
  return new CustomEvent(saving, { detail: { changedIds } });
}

export const saved = 'saved';
export const savedEvent = new CustomEvent(saved);

export const dueDateChanged = 'dueDateChanged';
/**
 * Due date was changed.
 *
 * @param {HTMLElement} target - The element sending the event. Hmmm. no need for custom?
 * @return {CustomEvent} detail object with target
 */
export const dueDateChangedEvent = function (target) {
  return new CustomEvent(dueDateChanged, { detail: { target } });
}

export const competencyChanged = 'competencyChanged';
/**
 * A competency was changed.
 *
 * @param {HTMLElement} target - The element sending the event. Hmmm. no need for custom?
 * @return {CustomEvent} detail object with target
 */
export const competencyChangedEvent = function (target) {
  return new CustomEvent(competencyChanged, { detail: { target } });
}

export const nextMeetingChanged = 'nextMeetingChanged';
export const nextMeetingChangedEvent = new CustomEvent(nextMeetingChanged);

export const nextMeetingSaved = 'nextMeetingSaved';
export const nextMeetingSavedEvent = new CustomEvent(nextMeetingSaved);

export const objectiveOrderChanged = 'objectiveOrderChanged';
export const objectiveOrderChangedEvent = new CustomEvent(objectiveOrderChanged);

export const editCoachChanged = 'editCoachChanged';
export const editCoachChangedEvent = new CustomEvent(editCoachChanged);

export const editCoachSaved = 'editCoachSaved';
export const editCoachSavedEvent = new CustomEvent(editCoachSaved);

export const error = 'error';
export const errorEvent = new CustomEvent(error);