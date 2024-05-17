import { Vector3 } from 'three'

export const findAndClonePosition = function<T>(obj: any, property = "position"): any | undefined {
  if (obj == null || typeof obj !== 'object') {
    return undefined;
  }

  if (property in obj && obj[property] != null) {
    return obj.position;
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const result = findAndClonePosition(obj[key]);
      if (result != null && result instanceof Vector3) {
        return result.clone();
      }
    }
  }

  return undefined;
}