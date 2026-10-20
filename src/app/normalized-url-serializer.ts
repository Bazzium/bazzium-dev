import { DefaultUrlSerializer, UrlTree } from '@angular/router';

export class NormalizedUrlSerializer extends DefaultUrlSerializer {
  override parse(url: string): UrlTree {
    // Static hosting can add a trailing slash to prerendered directory URLs.
    // Normalize only the path, preserving query parameters and fragments.
    const suffixIndex = url.search(/[?#]/);
    const path = suffixIndex === -1 ? url : url.slice(0, suffixIndex);
    const suffix = suffixIndex === -1 ? '' : url.slice(suffixIndex);

    return super.parse((path.replace(/\/+$/, '') || '/') + suffix);
  }
}
