import { createResource } from './suspense';

const cache = new Map<string, ReturnType<typeof createResource>>();

export function useSuspenseFetch<T>(url: string): T {
  let resource = cache.get(url);
  if (!resource) {
    resource = createResource(fetch(url).then((r) => r.json()));
    cache.set(url, resource);
  }
  return resource.read() as T;
}
