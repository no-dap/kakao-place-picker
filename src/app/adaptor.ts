import * as camelCase from 'lodash.camelcase';

const isObject = (value: any): boolean => {
  const type = typeof value;

  return !!value && (type === 'object');
};


/**
 * JSON 형식의 data 를 snake_case -> camelCase 로 전환 해주는 adaptor 입니다.
 */
export class ResponseAdaptor {
  private transform<T, V>(targetObject: T | any | object): V | any {
    if (Array.isArray(targetObject)) {
      return (targetObject as T[]).map(value => this.transform<T, V>(value)) as any;
    } else if (!isObject(targetObject)) {
      return targetObject;
    }

    const transformed = {};
    const keys = Object.keys(targetObject);

    for (const key of keys) {
      const value = targetObject[key];
      const transformedKey = camelCase(key);

      if (Array.isArray((value))) {
        transformed[transformedKey] = value.map(v => this.transform(v));
      } else if (isObject(value)) {
        transformed[transformedKey] = this.transform(value);
      } else {
        transformed[transformedKey] = value;
      }
    }

    return transformed as V;
  }

  adapt<T, V>(response: T): V {
    return this.transform<T, V>(response);
  }
}
