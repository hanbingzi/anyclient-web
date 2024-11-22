import { AllNodeType, ServerType } from '../types/server-node.types';
import { MaybePromise } from '@opensumi/ide-core-node';

export interface IBreadCrumbPart {
  name: string;

  server?: ServerType;

  nodeType?: AllNodeType;

  getSiblings?(): MaybePromise<{ parts: IBreadCrumbPart[]; currentIndex: number }>;

  // getChildren和onClick只能存在一个，如果同时存在,getChildren生效
  getChildren?(): MaybePromise<IBreadCrumbPart[]>;

  onClick?(): void;
}
