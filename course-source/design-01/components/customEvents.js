export const adding = 'adding';
export const addingEvent = new CustomEvent(adding);

export const added = 'added';
export const addedEvent = function (id) {
  return new CustomEvent(added, { detail: { id } });
}

export const updating = 'updating';
export const updatingEvent = new CustomEvent(updating);

export const updated = 'updated';
export const updatedEvent = new CustomEvent(updated);

export const saved = 'saved';
export const savedEvent = new CustomEvent(saved);

export const error = 'error';
export const errorEvent = new CustomEvent(error);