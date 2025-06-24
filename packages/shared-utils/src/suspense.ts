export function createResource<T>(promise: Promise<T>) {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T;
  let suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      result = e;
    },
  );
  return {
    read(): T {
      if (status === 'pending') {
        throw suspender;
      }
      if (status === 'error') {
        throw result;
      }
      return result;
    },
  };
}
