import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";

function directUpdate(data:any, path:any[], update:any) {
  let value = data;
  for (const prop of path) value = value[prop];
  Object.assign(value, update);
}

export default function createBasicContext<Store extends Record<string, unknown>>(initialState: Store) {
  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;
  
  function useStoreData(): {
    get: () => Store;
    set: (value?: Partial<Store>, direct?:any[], update?:any) => void;
    sub: (callback: () => void) => () => void;
  } {
    const store = useRef(initialState);
    const subs = useRef(new Set<() => void>());
    const get = useCallback(() => store.current, []);

    const set = useCallback((value?: Partial<Store>, direct?:any[], update?:any) => {
      if (direct && update) directUpdate(store.current, direct, update);
      if (value) Object.assign(store.current, value);

      subs.current.forEach((callback) => callback());
    }, []);

    const sub = useCallback((callback: () => void) => {
      subs.current.add(callback);
      
      return () => subs.current.delete(callback);
    }, []);

    return {
      get,
      set,
      sub,
    };
  }

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  function BasicProvider({ children }: { children: React.ReactNode }) {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    );
  }

  function useBasicStore<SelectorOutput>(
    selector: (store: Store) => SelectorOutput
  ): [SelectorOutput, (value?: Partial<Store>, direct?:any[], update?:any) => void] {
    const store = useContext(StoreContext);

    const state = useSyncExternalStore(
      store!.sub,
      () => selector(store!.get()),
      () => selector(initialState),
    );

    return [state, store!.set];
  }

  return {
    BasicProvider,
    useBasicStore,
  };
}
