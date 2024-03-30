import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// Return types for the hook.
interface QueryParamValue {
  defaultValue: string;
  value: string;
  valid: (value: string | null) => boolean;
}

type QueryState = { [queryParam: string]: QueryParamValue };

// Props passed into the hook.
interface QueryStateProp {
  defaultValue: string;
  valid: (value: string | null) => boolean;
}

type QueryStateProps = { [queryParam: string]: QueryStateProp };

interface useQueryStateProps {
  pathName: string;
  queryStates: QueryStateProps;
}

/**
 * Attempts to fetch and validate values from query params to use as state.
 * If invalid, falls back to default values.
 * @param searchParams SearchParams from the useSearchParams hook.
 * @param queryStates Initial queryStates passed into the hook.
 * @returns Initial QueryState from loading the page with/without query parameters
 */
function getDefaultValues(
  searchParams: ReadonlyURLSearchParams,
  queryStates: QueryStateProps
): QueryState {
  return Object.fromEntries(
    Object.entries(queryStates).map(([k, v]) => {
      const searchParamValue = searchParams.get(k);
      return [
        k,
        { ...v, value: v.valid(searchParamValue) ? (searchParamValue as string) : v.defaultValue },
      ];
    })
  );
}

/**
 * Hook to use query parameters as a state.
 * Reads and writes to the URL's query parameters for the specified values.
 */
export default function useQueryState({
  pathName,
  queryStates,
}: useQueryStateProps): [QueryState, (param: string, value: string | null) => void] {
  const searchParams = useSearchParams();
  const defaultValues = useMemo(
    () => getDefaultValues(searchParams, queryStates),
    [searchParams, queryStates]
  );
  const [states, setStates] = useState<QueryState>(defaultValues);

  useEffect(() => {
    // Whenever the states are updated, write them to the URL.
    const params = new URLSearchParams();
    Object.keys(states).forEach(key => {
      if (states[key]!.defaultValue !== states[key]!.value)
        params.set(key, states[key]?.value || '');
    });

    const stringifiedParams = params.toString();
    const newUrl = stringifiedParams.length === 0 ? pathName : `${pathName}?${stringifiedParams}`;
    window.history.replaceState(undefined, '', newUrl);
  }, [pathName, states]);

  const changeState = (param: string, value: string | null) => {
    // Update the specific parameter of the state if the value is valid.
    const newStates = { ...states };
    if (Object.prototype.hasOwnProperty.call(newStates, param) && newStates[param]!.valid(value)) {
      newStates[param]!.value = value as string;
    }
    setStates(newStates);
  };

  return [states, changeState];
}
