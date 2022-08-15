/**
 * A series of custom events that help identify what is happening
 * and also allows us to pass data where needed.
 */

export const adding = 'adding';
export const addingEvent = function (title) {
  return new CustomEvent(adding, { detail: { title } });
}

/**
 * API call was successful
 *
 * @param {string} id - objective ID
 * @param {string} title - objective ID
 * @return {CustomEvent} detail object with id and title
 */
export const added = 'added';
export const addedEvent = function (id, title) {
  return new CustomEvent(added, { detail: { id, title } });
}

export const deleting = 'deleting';
export const deletingEvent = function (id) {
  return new CustomEvent(deleting, { detail: { id } });
}

export const deleted = 'deleted';
export const deletedEvent = function (id) {
  return new CustomEvent(deleted, { detail: { id } });
}

export const updating = 'updating';
export const updatingEvent = new CustomEvent(updating);

export const updated = 'updated';
export const updatedEvent = new CustomEvent(updated);

export const dueDateChanged = 'dueDateChanged';
export const dueDateChangedEvent = function (target) {
  return new CustomEvent(dueDateChanged, { detail: { target } });
}

export const competencyChanged = 'competencyChanged';
export const competencyChangedEvent = function (target) {
  return new CustomEvent(competencyChanged, { detail: { target } });
}

export const nextMeetingChanged = 'nextMeetingChanged';
export const nextMeetingChangedEvent = new CustomEvent(nextMeetingChanged);

export const objectiveOrderChanged = 'objectiveOrderChanged';
export const objectiveOrderChangedEvent = new CustomEvent(objectiveOrderChanged);

export const error = 'error';
export const errorEvent = new CustomEvent(error);