import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// Return types for the hook.
interface QueryParamValue {
  defaultValue: string;
  value: string;
  valid: (value: string) => boolean;
}

type QueryState = { [queryParam: string]: QueryParamValue };

// Props passed into the hook.
interface QueryStateProp {
  defaultValue: string;
  valid: (value: string) => boolean;
}

type QueryStateProps = { [queryParam: string]: QueryStateProp };

type InitialQueryParams = { [query: string]: string };
interface useQueryStateProps {
  pathName: string;
  initialFilters: InitialQueryParams;
  queryStates: QueryStateProps;
}

/**
 * Attempts to fetch and validate values from query params (server side) to use as state.
 * If invalid, falls back to default values.
 * @param initialFilters Key value pairs of query params fetched from gSSR.
 * @param queryStates Initial queryStates passed into the hook.
 * @returns Initial QueryState from loading the page with/without query parameters
 */
function getDefaultValues(
  initialFilters: InitialQueryParams,
  queryStates: QueryStateProps
): QueryState {
  return Object.fromEntries(
    Object.entries(queryStates).map(([k, v]) => {
      const initialValue = initialFilters[k];
      const validValue = initialValue !== undefined && v.valid(initialValue);
      return [k, { ...v, value: validValue ? initialValue : v.defaultValue }];
    })
  );
}

/**
 * Attempts to fetch and validate values from query params (client side) to use as state.
 * If invalid, falls back to default values.
 * @param searchParams Client side query params (from useSearchParams).
 * @param queryStates Initial queryStates passed into the hook.
 * @returns Initial QueryState from loading the page with/without query parameters
 */
function getValuesFromSearchParams(
  searchParams: ReadonlyURLSearchParams,
  states: QueryState
): QueryState {
  return Object.fromEntries(
    Object.entries(states).map(([k, v]) => {
      const searchValue = searchParams.get(k);
      const validValue = searchValue !== null && v.valid(searchValue);
      return [k, { ...v, value: validValue ? searchValue : v.defaultValue }];
    })
  );
}

/**
 * Returns if states and searchParams (aka query params) have the same values.
 */
function isURLSynced(searchParams: ReadonlyURLSearchParams, states: QueryState): boolean {
  return Object.entries(states).every(([k]) => {
    const value = searchParams.get(k);
    return value === states[k]?.value;
  });
}

/**
 * Hook to use query parameters as a state.
 * Reads and writes to the URL's query parameters for the specified values.
 */
export default function useQueryState({
  pathName,
  initialFilters,
  queryStates,
}: useQueryStateProps): [QueryState, (param: string, value: string) => void] {
  const defaultValues = useMemo(
    () => getDefaultValues(initialFilters, queryStates),
    [initialFilters, queryStates]
  );
  const [states, setStates] = useState<QueryState>(defaultValues);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Direction 1: Update the URL whenever state values change.
    if (!isURLSynced(searchParams, states)) {
      // Whenever the states are updated, write them to the URL.
      const params = new URLSearchParams();
      Object.keys(states).forEach(key => {
        if (states[key]!.defaultValue !== states[key]!.value)
          params.set(key, states[key]?.value || '');
      });

      const stringifiedParams = params.toString();
      const newUrl = stringifiedParams.length === 0 ? pathName : `${pathName}?${stringifiedParams}`;
      window.history.replaceState(undefined, '', newUrl);
    }
    // If we add searchParams as a dependency here, changing the URL params will enter an infinite callback loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName, states]);

  useEffect(() => {
    // Direction 2: Update states whenever the URL changes.
    if (!isURLSynced(searchParams, states)) {
      // If the URL state has directly changed, we should update the client filter state to match
      setStates(getValuesFromSearchParams(searchParams, states));
    }
    // If we add the filter state as a depeandency here, changing the URL params will enter an infinite callback loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const changeState = (param: string, value: string) => {
    // Update the specific parameter of the state if the value is valid.
    const newStates = { ...states };

    if (Object.prototype.hasOwnProperty.call(newStates, param) && newStates[param]!.valid(value)) {
      newStates[param]!.value = value;
    }
    setStates(newStates);
  };

  return [states, changeState];
}
