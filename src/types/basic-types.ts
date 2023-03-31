import { BasicError } from "./error";

export interface BasicObject<T> {
    [key:string]: T; 
}

export interface BasicMap<T> extends Map<string, T> {};

export interface BasicResult<T> {
    result?: T;
    error?: BasicError;
}