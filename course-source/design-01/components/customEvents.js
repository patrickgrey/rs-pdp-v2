export const adding = 'adding';
export const addingEvent = new CustomEvent(adding);

export const added = 'added';
export const addedEvent = function (id, title) {
  return new CustomEvent(added, { detail: { id, title } });
}

export const updating = 'updating';
export const updatingEvent = new CustomEvent(updating);

export const updated = 'updated';
export const updatedEvent = new CustomEvent(updated);

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