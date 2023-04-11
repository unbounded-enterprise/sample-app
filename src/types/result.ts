import { BasicResult } from "./basic-types";

export interface AnyResult extends BasicResult<any> {};
export interface ArrayResult extends BasicResult<any[]> {};
export interface StringResult extends BasicResult<string> {};
export interface NumberResult extends BasicResult<number> {};
export interface BooleanResult extends BasicResult<boolean> {};