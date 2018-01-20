import { root } from 'rxjs/util/root';
import { Saki_JWT, Saki_USER } from './utils/utils';

export class Storage {
  constructor() {}
  setItem(user, token) {
    root.localStorage.setItem(Saki_USER, user);
    root.localStorage.setItem(Saki_JWT, token);
  }
  getItem(key) {
    return root.localStorage.getItem(key);
  }
  removeItem(key) {
    return root.localStorage.removeItem(key);
  }
  clear() {
    root.localStorage.removeItem(Saki_JWT);
    root.localStorage.removeItem(Saki_USER);
  }
}

export class Account {
  storage: Storage;
  authType: string;
  userInfo: Object;
  
  constructor() {
    this.storage = new Storage();
  }

  set(user: string, token: string) {
    this.storage.setItem(user, token);
  }

  get(key: string) {
    return this.storage.getItem(key);
  }

  clear() {
    this.storage.clear();
  }

  setUp(authType, userInfo?: Object) {
    this.authType = authType;
    if (userInfo) {
      this.userInfo = userInfo;
    }
  }

  createUser(userInfo) {
    this.userInfo = userInfo;
    return { method: 'signup', userInfo: this.userInfo };
  }

  handshake() {
    if (this.authType === 'unauthenticated') {
      return { method: this.authType };
    } else if (this.authType === 'login') {
      return { method: this.authType, userInfo: this.userInfo };
    } else if (this.authType === 'token') {
      const token = this.get(Saki_JWT);
      if (typeof token === 'string') {
        return { method: this.authType, token};
      } else {
        throw new Error('invalid token');
      }
    } else {
      throw new Error('auth failed');
    }
  }
}