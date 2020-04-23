import { render, fireEvent } from '@testing-library/react';

export function dispatchEvt(node: Element, type: string, data: unknown) {
  const event = new Event(type, { bubbles: true });
  if (data) {
    Object.assign(event, data);
  }
  fireEvent(node, event);
}

export function flushPromises(ui: React.ReactElement, container: HTMLElement) {
  return new Promise(resolve =>
    setImmediate(() => {
      render(ui, { container });
      resolve(container);
    })
  );
}

export function createFile(name: string, size: number, type: string) {
  const file = new File([], name, { type });
  Object.defineProperty(file, 'size', {
    get() {
      return size;
    }
  });
  return file;
}

export function createDtWithFiles(files: File[] = []) {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        size: file.size,
        type: file.type,
        getAsFile: () => file
      })),
      types: ['Files']
    }
  };
}
